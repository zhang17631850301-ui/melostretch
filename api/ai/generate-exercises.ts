import { GoogleGenAI, Type } from '@google/genai';

const ALLOWED_MODELS = new Set(['gemini-3.1-flash-lite', 'gemini-3.6-flash']);
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = String(req.headers['x-gemini-api-key'] || '').trim();
    if (!apiKey) return res.status(400).json({ error: '请先点击页面右上角的设置按钮，配置你自己的 Gemini API Key' });
    const requestedModel = String(req.headers['x-gemini-model'] || '').trim();
    const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : DEFAULT_MODEL;

    const { muscleName, muscleId, categoryName, userPreference } = req.body || {};
    if (!muscleName) return res.status(400).json({ error: 'Muscle name is required' });

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `你是一位顶级的物理治疗师（PT）与运动康复专家。
请针对部位【${muscleName}】（属于 ${categoryName || '肌肉'}），结合用户需求【${userPreference || '适合办公室内或日常快速完成的动作'}】，生成 2 到 3 个专业、安全、精准且易于操作的科学舒缓或拉伸动作。

要求：
1. 动作必须符合解剖学原理，能精准牵拉或激活【${muscleName}】。
2. 姿势与场地灵活，可以使用站立、靠墙、扶桌、坐姿办公椅或纯徒手动作。
3. 步骤拆解清晰易懂，包含安全注意事项。
4. 难度标注为“轻松”“初级”或“进阶”。`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: '你是专业的肌肉康复与动作指导AI助手。请输出规范的JSON格式数组。',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              durationSeconds: { type: Type.INTEGER },
              suggestedSets: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              equipment: { type: Type.STRING },
              benefits: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'detail'],
                },
              },
              cautions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'durationSeconds', 'suggestedSets', 'difficulty', 'equipment', 'benefits', 'steps', 'cautions'],
          },
        },
      },
    });

    const exercisesData = JSON.parse(response.text || '[]');
    const exercises = exercisesData.map((ex: any, idx: number) => ({
      id: `ai_${muscleId || 'custom'}_${Date.now()}_${idx}`,
      name: ex.name,
      targetMuscleIds: [muscleId || 'custom'],
      primaryMuscleName: muscleName,
      durationSeconds: ex.durationSeconds || 30,
      suggestedSets: ex.suggestedSets || '2组 x 30秒',
      difficulty: ['轻松', '初级', '进阶'].includes(ex.difficulty) ? ex.difficulty : '初级',
      equipment: ex.equipment || '无设备',
      benefits: ex.benefits,
      steps: ex.steps,
      cautions: ex.cautions || ['若有剧烈疼痛，请立即停止。'],
      iconName: 'Sparkles',
      isAiGenerated: true,
    }));

    return res.status(200).json({ success: true, exercises });
  } catch (error: any) {
    console.error('Gemini generate exercises error:', error);
    return res.status(500).json({
      error: 'AI 生成动作失败，请检查 API Key 是否有效或稍后重试',
      details: error?.message || String(error),
    });
  }
}
