import React, { useState } from 'react';
import { MuscleInfo, Exercise } from '../types';
import { MUSCLE_STRAINS } from '../data/meloStretchData';
import { getGeminiRequestHeaders } from '../utils/geminiKey';
import { PostureIllustration } from './PostureIllustration';
import { X, Play, Heart, AlertTriangle, Lightbulb, MapPin, CheckCircle2, Sparkles, Loader2, PlusCircle, RefreshCw, Plus, Check, ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface MuscleDetailModalProps {
  muscle: MuscleInfo | null;
  exercises: Exercise[];
  onClose: () => void;
  onStartExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (exerciseId: string) => void;
  onAddAiExercise?: (exercise: Exercise) => void;
}

export const MuscleDetailModal: React.FC<MuscleDetailModalProps> = ({
  muscle,
  exercises,
  onClose,
  onStartExercise,
  favorites,
  onToggleFavorite,
  onAddAiExercise
}) => {
  const [showAiPanel, setShowAiPanel] = useState<boolean>(false);
  const [userPref, setUserPref] = useState<string>('工位徒手快速拉伸');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  if (!muscle) return null;

  const strainInfo = MUSCLE_STRAINS[muscle.id];

  const quickPrefs = [
    '站立式全身牵拉放松',
    '站立靠墙开胸伸展',
    '站立下肢/腘绳肌牵拉',
    '工位徒手站立/坐姿拉伸',
    '办公椅深度牵拉',
    '低头族站立姿势矫正',
    '短时零噪音静音动作'
  ];

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-exercises', {
        method: 'POST',
        headers: getGeminiRequestHeaders(),
        body: JSON.stringify({
          muscleName: muscle.name,
          muscleId: muscle.id,
          categoryName: muscle.categoryName,
          userPreference: userPref
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.exercises)) {
        data.exercises.forEach((ex: Exercise) => {
          if (onAddAiExercise) {
            onAddAiExercise(ex);
          }
        });
        setGeneratedCount(prev => prev + data.exercises.length);
        setShowAiPanel(false);
      } else {
        setErrorMsg(data.error || '生成失败，请重试');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('网络请求异常，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-fadeIn overflow-y-auto select-none">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-emerald-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs border border-white/20">
              🌱 {muscle.categoryName}
            </span>
            <span className="text-amber-200 text-xs font-bold">
              ID: {muscle.id}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>{muscle.name}</span>
            <span className="text-xl">✨</span>
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 font-medium">
            {muscle.englishName}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-100 bg-black/15 px-3 py-1.5 rounded-2xl border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>解剖位置：{muscle.locationText}</span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 scrollbar-thin">
          {/* Basic Description */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100/80">
            <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🌱 肌肉概况与健康作用</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {muscle.description}
            </p>
          </div>

          {/* Strain Causes Section */}
          {strainInfo?.causes && strainInfo.causes.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-800 flex items-center gap-2 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>常见办公劳损原因</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {strainInfo.causes.map((cause, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms Felt by User Section */}
          {strainInfo?.symptoms && strainInfo.symptoms.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-800 flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>您可能感觉到的疲劳症状</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {strainInfo.symptoms.map((sym, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Severity & Soothing Tip */}
          {strainInfo?.severityTip && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <div>
                <span className="font-bold">Melo 工位舒缓建议：</span>
                {strainInfo.severityTip}
              </div>
            </div>
          )}

          {/* Recommended Exercises Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-gray-800 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>舒缓动作库 ({exercises.length} 个)</span>
              </h3>

              {/* AI Expansion Trigger Button */}
              <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>✨ AI 联网拓展更多动作</span>
              </button>
            </div>

            {/* AI Exercise Generator Panel */}
            {showAiPanel && (
              <div className="mb-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>针对【{muscle.name}】进行 AI 深度解剖学检索与定制</span>
                  </div>
                  <button
                    onClick={() => setShowAiPanel(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
                  >
                    收起
                  </button>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  除内置基本数据库外，AI 助手可联网根据运动解剖学与您的场景需求，即时扩展生成全新的针对性舒缓动作：
                </p>

                {/* Quick Option Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {quickPrefs.map((pref, i) => (
                    <button
                      key={i}
                      onClick={() => setUserPref(pref)}
                      className={`px-2.5 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                        userPref === pref
                          ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                          : 'bg-white text-gray-700 border border-emerald-100 hover:bg-emerald-100/50'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>

                {/* Custom Prompt Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userPref}
                    onChange={(e) => setUserPref(e.target.value)}
                    placeholder="输入您的特殊需求（如：站立靠墙拉伸、纯徒手无设备、站立开胸等）..."
                    className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                  <button
                    onClick={handleGenerateAi}
                    disabled={isGenerating || !userPref.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI 智能分析生成中...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>生成新动作</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {exercises.map((ex) => {
                const isFav = favorites.includes(ex.id);
                const isExpanded = expandedExerciseId === ex.id;

                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-2xl bg-white border transition-all flex flex-col gap-3 ${
                      ex.isAiGenerated
                        ? 'border-emerald-300 ring-1 ring-emerald-200 bg-gradient-to-r from-emerald-50/30 to-white'
                        : 'border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {ex.isAiGenerated && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-extrabold flex items-center gap-1 border border-amber-300/80">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              AI 联网拓展
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            📍 {ex.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            需要：{ex.equipment}
                          </span>
                          <span className="text-xs text-gray-400">
                            • {ex.suggestedSets}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                          {ex.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          ✨ {ex.benefits}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                        {/* Toggle Posture Illustration / Action Tips */}
                        <button
                          onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                          className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isExpanded
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isExpanded ? '收起 Tips' : '发力 Tips 💡'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={() => {
                            if (ex.isAiGenerated && onAddAiExercise) {
                              onAddAiExercise(ex);
                            }
                            onToggleFavorite(ex.id);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            isFav
                              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title={isFav ? '从我的办公室方案移除' : '添加至我的办公室方案'}
                        >
                          {isFav ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-rose-600" />
                              <span>已在方案</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-emerald-700" />
                              <span>加入方案</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onStartExercise(ex);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          跟练
                        </button>
                      </div>
                    </div>

                    {/* Expanded Posture Illustration Panel */}
                    {isExpanded && (
                      <div className="mt-2 pt-3 border-t border-emerald-100 animate-fadeIn">
                        <PostureIllustration exercise={ex} />
                      </div>
                    )}
                  </div>
                );
              })}

              {exercises.length === 0 && (
                <div className="p-6 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl">
                  暂未录入专属动作，请返回查看通用舒缓方案。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
