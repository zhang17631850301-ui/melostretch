import React, { useState } from 'react';
import { SolutionRoutine, Exercise } from '../types';
import { OFFICE_SOLUTIONS, EXERCISES_DATABASE } from '../data/meloStretchData';
import { Play, Clock, CheckCircle2, Sparkles, ArrowRight, Layers, ShieldCheck, Heart, Coffee } from 'lucide-react';

interface SolutionsViewProps {
  onStartExercise: (ex: Exercise) => void;
  onSelectSolution?: (sol: SolutionRoutine) => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ onStartExercise }) => {
  const [activeRoutine, setActiveRoutine] = useState<SolutionRoutine>(OFFICE_SOLUTIONS[0]);

  // Find exercises included in active routine
  const routineExercises = activeRoutine.exerciseIds
    .map((id) => EXERCISES_DATABASE.find((ex) => ex.id === id))
    .filter((ex): ex is Exercise => Boolean(ex));

  return (
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Page Header with Cute Mascot Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-4 top-2 text-white/10 text-8xl font-black pointer-events-none">
          🎒 🌿
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold backdrop-blur-xs border border-white/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>工位场景一键连贯舒缓 · 拯救疲惫</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                快捷组合 ☕
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              办公室极速四大方案 ✨
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              无需离开工位，不惹同事注意！3~5 分钟跟着连贯动画序列动起来，让肩膀和腰椎立刻回复满满活力~
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3 text-xs shrink-0 shadow-xs">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="font-bold text-amber-200">Melo 温馨提醒</p>
              <p className="text-[11px] text-emerald-100">随时点开，做完一整套肌肉更轻松哦！</p>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {OFFICE_SOLUTIONS.map((sol) => {
          const isSelected = activeRoutine.id === sol.id;

          const iconsMap: Record<string, string> = {
            sol_neck_shoulder: '🦒',
            sol_lower_back: '💻',
            sol_wrist_hand: '⌨️',
            sol_micro_breaks: '☕'
          };

          const icon = iconsMap[sol.id] || '✨';

          return (
            <div
              key={sol.id}
              onClick={() => setActiveRoutine(sol)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-2 group active:scale-98 ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300/40'
                  : 'bg-white hover:bg-emerald-50/60 border-emerald-100 text-gray-800 shadow-2xs hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-emerald-800/80 text-emerald-100 border-emerald-400/30'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                  }`}
                >
                  {sol.category}
                </span>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    isSelected ? 'text-amber-200' : 'text-gray-400'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {sol.durationMinutes} 分钟
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-bold text-sm leading-snug">{sol.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Routine Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                🌱 {activeRoutine.category}
              </span>
              <span className="text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
                ⏱️ 预估时长：{activeRoutine.durationMinutes} 分钟
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2">
              <span>{activeRoutine.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
              {activeRoutine.description}
            </p>
          </div>

          <button
            onClick={() => {
              if (routineExercises[0]) {
                onStartExercise(routineExercises[0]);
              }
            }}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            开启组合首项动作跟练
          </button>
        </div>

        {/* Exercises Included in Routine */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>方案包含动作与舒缓重点 ({routineExercises.length} 个)</span>
          </h3>

          <div className="space-y-3">
            {routineExercises.map((ex, index) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all shadow-2xs group"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-extrabold text-emerald-800">
                        📍 {ex.primaryMuscleName}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        • {ex.suggestedSets} ({ex.durationSeconds}秒)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-800 transition-colors">
                      {ex.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-relaxed">
                      ✨ {ex.benefits}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartExercise(ex)}
                  className="px-4 py-2 bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200/80 shadow-2xs transition-all flex items-center gap-1.5 self-end sm:self-center active:scale-95 cursor-pointer"
                >
                  <span>跟练此项</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
