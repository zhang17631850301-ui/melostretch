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

    const query = String(req.body?.query || '').trim();
    if (!query) return res.status(400).json({ error: 'Search query is required' });

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: `你是一位权威的物理治疗师、人体解剖学专家与运动康复顾问。用户输入的不适症状或部位是：【${query}】。请分析症状名称、2至3个可能成因、3条日常缓解建议、相关肌肉，并推荐2个简单安全的工位拉伸动作。`,
      config: {
        systemInstruction: '你是专业的肌肉康复与身体不适排查AI助手。请严格输出结构化JSON对象，不替代医生诊断。',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptomTitle: { type: Type.STRING },
            painCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { title: { type: Type.STRING }, detail: { type: Type.STRING } },
                required: ['title', 'detail'],
              },
            },
            reliefMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
            relatedMuscleNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedExercises: {
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
          required: ['symptomTitle', 'painCauses', 'reliefMethods', 'relatedMuscleNames', 'recommendedExercises'],
        },
      },
    });

    return res.status(200).json({ success: true, analysis: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Gemini pain search error:', error);
    return res.status(500).json({
      error: 'AI 搜索失败，请检查 API Key 是否有效或稍后重试',
      details: error?.message || String(error),
    });
  }
}
