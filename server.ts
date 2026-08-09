import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

function getAiClient(req: express.Request): GoogleGenAI {
  const headerValue = req.header("X-Gemini-API-Key")?.trim();
  if (!headerValue) {
    throw new Error("请先点击页面右上角的设置按钮，配置你自己的 Gemini API Key");
  }

  return new GoogleGenAI({
    apiKey: headerValue,
    httpOptions: { headers: { "User-Agent": "melostretch-byok" } },
  });
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", apiKeyMode: "user-provided" });
});

// API Route: Generate expanded exercises for specific muscle
app.post("/api/ai/generate-exercises", async (req, res) => {
  try {
    const ai = getAiClient(req);
    const { muscleName, muscleId, categoryName, userPreference } = req.body;

    if (!muscleName) {
      return res.status(400).json({ error: "Muscle name is required" });
    }

    const prompt = `你是一位顶级的物理治疗师（PT）与运动康复专家。
请针对部位【${muscleName}】（属于 ${categoryName || '肌肉'}），结合用户需求【${userPreference || '适合办公室内或日常快速完成的动作'}】，生成 2 到 3 个专业、安全、精准且易于操作的科学舒缓或拉伸动作。

要求：
1. 动作必须符合解剖学原理，能精准牵拉或激活【${muscleName}】。
2. 姿势与场地灵活性：可以包含【站立姿势拉伸】、【站立靠墙伸展】、【站立扶桌拉伸】、【坐姿办公椅拉伸】或【纯徒手动作】，绝不局限于坐在办公椅上。如果用户选择了站立相关需求，请优先生成简单有效的站立拉伸动作。
3. 步骤拆解清晰易懂，包含安全注意事项。
4. 难度标注为 "轻松"、"初级" 或 "进阶"。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一个专业的肌肉康复与动作指导AI助手。请输出规范的JSON格式数组。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "生成的新舒缓动作列表",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "动作名称，如：站立靠墙W字胸肌伸展 或 站立单腿腘绳肌牵拉" },
              durationSeconds: { type: Type.INTEGER, description: "单次练习时长秒数，如 30" },
              suggestedSets: { type: Type.STRING, description: "建议组数，如：2组 x 30秒" },
              difficulty: { type: Type.STRING, description: "难度，必须为：轻松、初级、进阶 之一" },
              equipment: { type: Type.STRING, description: "所需设备，必须为：无设备、办公椅、墙面、办公桌、站立徒手、站立/靠墙 之一" },
              benefits: { type: Type.STRING, description: "动作功效与针对的舒缓感受" },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER, description: "步骤序号，从 1 开始" },
                    title: { type: Type.STRING, description: "步骤标题，如：调整站姿" },
                    detail: { type: Type.STRING, description: "具体动作指令与呼吸配合" },
                  },
                  required: ["stepNumber", "title", "detail"],
                },
              },
              cautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "安全注意事项与禁忌",
              },
            },
            required: ["name", "durationSeconds", "suggestedSets", "difficulty", "equipment", "benefits", "steps", "cautions"],
          },
        },
      },
    });

    const text = response.text || "[]";
    const exercisesData = JSON.parse(text);

    // Add required IDs and format for client
    const formattedExercises = exercisesData.map((ex: any, idx: number) => ({
      id: `ai_${muscleId || 'custom'}_${Date.now()}_${idx}`,
      name: ex.name,
      targetMuscleIds: [muscleId || 'custom'],
      primaryMuscleName: muscleName,
      durationSeconds: ex.durationSeconds || 30,
      suggestedSets: ex.suggestedSets || "2组 x 30秒",
      difficulty: ["轻松", "初级", "进阶"].includes(ex.difficulty) ? ex.difficulty : "初级",
      equipment: ["无设备", "办公椅", "墙面", "办公桌", "站立徒手", "站立/靠墙"].includes(ex.equipment) ? ex.equipment : "无设备",
      benefits: ex.benefits,
      steps: ex.steps,
      cautions: ex.cautions || ["若有剧烈疼痛，请立即停止。"],
      iconName: "Sparkles",
      isAiGenerated: true,
    }));

    return res.json({ success: true, exercises: formattedExercises });
  } catch (error: any) {
    console.error("Error generating exercises with Gemini:", error);
    const needsKey = error?.message?.includes("配置你自己的 Gemini API Key");
    return res.status(needsKey ? 400 : 500).json({
      error: needsKey ? error.message : "AI 生成动作失败，请检查 Key、网络或稍后重试",
      details: error?.message || String(error),
    });
  }
});

// API Route: AI Pain Search & Symptom Analysis
app.post("/api/ai/search-pain", async (req, res) => {
  try {
    const ai = getAiClient(req);
    const { query } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const prompt = `你是一位权威的物理治疗师（PT）、人体解剖学专家与运动康复顾问。
用户在【办公室身体舒缓与肌肉排查】应用中输入了不适症状或部位搜索词：【${query}】。

请针对该症状进行智能医学康复诊断分析，输出结构化JSON：
1. 总结用户的具体症状名称（symptomTitle）。
2. 分析该部位出现这种酸痛、僵硬或刺痛的 2 ~ 3 个核心解剖学/生物力学成因（painCauses）。
3. 提供 3 条针对性的办公室日常应对与缓解建议（reliefMethods）。
4. 给出可能牵涉的肌肉名称列表（relatedMuscleNames，如："斜方肌上束", "胸小肌", "腰方肌"）。
5. 推荐 2 个简单高效的工位缓解拉伸动作（recommendedExercises）。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一个专业的肌肉康复与身体不适排查AI助手。请严格输出结构化JSON对象。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptomTitle: { type: Type.STRING, description: "总结用户的症状名称，如：肩颈僵硬与斜方肌劳损" },
            painCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "痛因简述，如：低头看屏幕导致颈椎前倾负荷过重" },
                  detail: { type: Type.STRING, description: "详细医学/姿势原理解释" }
                },
                required: ["title", "detail"]
              },
              description: "引发该部位不适的核心成因"
            },
            reliefMethods: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "实用日常应对与姿势调整建议"
            },
            relatedMuscleNames: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "关联的相关肌肉中文名称"
            },
            recommendedExercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "动作名称" },
                  durationSeconds: { type: Type.INTEGER, description: "单次时长秒数，如 30" },
                  suggestedSets: { type: Type.STRING, description: "建议组数，如 2组 x 30秒" },
                  difficulty: { type: Type.STRING, description: "难度：轻松、初级、进阶" },
                  equipment: { type: Type.STRING, description: "设备：无设备、办公椅、墙面、办公桌" },
                  benefits: { type: Type.STRING, description: "动作功效" },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        detail: { type: Type.STRING }
                      },
                      required: ["stepNumber", "title", "detail"]
                    }
                  },
                  cautions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name", "durationSeconds", "suggestedSets", "difficulty", "equipment", "benefits", "steps", "cautions"]
              }
            }
          },
          required: ["symptomTitle", "painCauses", "reliefMethods", "relatedMuscleNames", "recommendedExercises"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return res.json({ success: true, analysis: data });
  } catch (error: any) {
    console.error("Error in AI pain search:", error);
    const needsKey = error?.message?.includes("配置你自己的 Gemini API Key");
    return res.status(needsKey ? 400 : 500).json({
      error: needsKey ? error.message : "AI 搜索失败，请检查 Key、网络或稍后重试",
      details: error?.message || String(error)
    });
  }
});

// Vite middleware or static server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MeloStretch fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  void setupServer();
}

export default app;
