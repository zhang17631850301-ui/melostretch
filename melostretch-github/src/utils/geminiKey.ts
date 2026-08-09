const GEMINI_KEY_STORAGE = 'melostretch_gemini_api_key';

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
    ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {})
  };
}
