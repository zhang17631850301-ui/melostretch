import React, { useState } from 'react';
import { Check, Eye, EyeOff, KeyRound, Settings, Trash2, X } from 'lucide-react';
import {
  clearGeminiApiKey,
  GEMINI_MODELS,
  GeminiModelId,
  getGeminiApiKey,
  getGeminiModel,
  saveGeminiApiKey,
  saveGeminiModel,
} from '../utils/geminiKey';

export const ApiKeySettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => getGeminiApiKey());
  const [model, setModel] = useState<GeminiModelId>(() => getGeminiModel());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const isConfigured = Boolean(getGeminiApiKey());

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveGeminiApiKey(apiKey);
    saveGeminiModel(model);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const handleClear = () => {
    clearGeminiApiKey();
    setApiKey('');
    setSaved(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2.5 rounded-xl border transition-all relative ${
          isConfigured
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
        }`}
        title={isConfigured ? 'Gemini API Key 已配置' : '配置你自己的 Gemini API Key'}
      >
        <Settings className="w-4 h-4" />
        <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900">配置 Gemini API Key</h2>
                  <p className="text-xs text-gray-500 mt-0.5">使用你自己的额度调用 AI 功能</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 leading-relaxed mb-4">
              Key 仅保存在当前浏览器中，并通过加密网络临时发送给 MeloStretch 后端调用 Gemini；服务器不会保存它。请只在你信任的设备上使用。
            </div>

            <label className="text-xs font-bold text-gray-700">你的 Gemini API Key</label>
            <div className="relative mt-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="AIza..."
                autoComplete="off"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-700" type="button">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-emerald-700 hover:underline">
              没有 Key？前往 Google AI Studio 免费申请 ↗
            </a>

            <div className="mt-5">
              <label className="text-xs font-bold text-gray-700" htmlFor="gemini-model">调用模型</label>
              <select
                id="gemini-model"
                value={model}
                onChange={(event) => setModel(event.target.value as GeminiModelId)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {GEMINI_MODELS.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {GEMINI_MODELS.find((option) => option.id === model)?.description}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button onClick={handleSave} disabled={!apiKey.trim()} className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-sm font-bold flex items-center justify-center gap-2">
                {saved ? <><Check className="w-4 h-4" /> 已保存</> : '保存并启用 AI'}
              </button>
              {isConfigured && (
                <button onClick={handleClear} className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100" title="清除本机保存的 Key">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
