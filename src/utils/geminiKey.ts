const GEMINI_KEY_STORAGE = 'melostretch_gemini_api_key';
const GEMINI_MODEL_STORAGE = 'melostretch_gemini_model';

export const GEMINI_MODELS = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    description: '推荐 · 响应快，免费额度通常更宽松',
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    description: '能力更强 · 适合较复杂的分析',
  },
] as const;

export type GeminiModelId = (typeof GEMINI_MODELS)[number]['id'];
export const DEFAULT_GEMINI_MODEL: GeminiModelId = 'gemini-3.1-flash-lite';

export function getGeminiModel(): GeminiModelId {
  try {
    const saved = localStorage.getItem(GEMINI_MODEL_STORAGE);
    return GEMINI_MODELS.some((model) => model.id === saved)
      ? (saved as GeminiModelId)
      : DEFAULT_GEMINI_MODEL;
  } catch {
    return DEFAULT_GEMINI_MODEL;
  }
}

export function saveGeminiModel(modelId: GeminiModelId): void {
  if (!GEMINI_MODELS.some((model) => model.id === modelId)) return;
  localStorage.setItem(GEMINI_MODEL_STORAGE, modelId);
}

export function getGeminiApiKey(): string {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE)?.trim() || '';
  } catch {
    return '';
  }
}

export function saveGeminiApiKey(apiKey: string): void {
  const value = apiKey.trim();
  if (!value) return;
  localStorage.setItem(GEMINI_KEY_STORAGE, value);
}

export function clearGeminiApiKey(): void {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
}

export function getGeminiRequestHeaders(): Record<string, string> {
  const apiKey = getGeminiApiKey();
  return {
    'Content-Type': 'application/json',
    'X-Gemini-Model': getGeminiModel(),
    ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {})
  };
}
