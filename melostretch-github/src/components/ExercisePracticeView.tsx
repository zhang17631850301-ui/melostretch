import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { playChimeSound, playTickSound } from '../utils/audio';
import { saveUserLog } from '../utils/storage';
import { PostureIllustration } from './PostureIllustration';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowLeft, Heart, ShieldAlert, Sparkles, Volume2, VolumeX, PartyPopper, Eye, Compass, BookOpen } from 'lucide-react';

interface ExercisePracticeViewProps {
  exercise: Exercise;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onComplete?: () => void;
}

export const ExercisePracticeView: React.FC<ExercisePracticeViewProps> = ({
  exercise,
  onBack,
  favorites,
  onToggleFavorite,
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(exercise.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'illustration' | 'steps'>('illustration');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoggedRef = useRef<boolean>(false);
  const isFav = favorites.includes(exercise.id);

  // Step emojis
  const stepEmojis = ['🌱', '🐾', '🌟', '🎈', '⚡', '🐱', '🐣'];

  // Mascot companion helper
  const getMascotCompanion = (exName: string) => {
    if (exName.includes('🐱') || exName.includes('猫咪') || exName.includes('猫') || exName.includes('抱臂') || exName.includes('鹰手') || exName.includes('拱背')) {
      return {
        idleEmoji: '🐱',
        runningEmoji: '😸',
        completedEmoji: '😻',
        name: '猫咪 Melo',
        motto: '像小猫伸懒腰一样低头拱背拉开两肩胛骨，解脱上背僵硬~'
      };
    }
    if (exName.includes('🐣') || exName.includes('小鸡') || exName.includes('翅膀') || exName.includes('W字')) {
      return {
        idleEmoji: '🐣',
        runningEmoji: '🐤',
        completedEmoji: '🐥',
        name: '小鸡萌萌',
        motto: '双手像小翅膀做W字下拉，后背夹紧唤醒沉睡背肌！'
      };
    }
    if (exName.includes('🐾') || exName.includes('小熊') || exName.includes('熊') || exName.includes('垫脚') || exName.includes('泵血')) {
      return {
        idleEmoji: '🐾',
        runningEmoji: '🐻',
        completedEmoji: '🐻‍❄️',
        name: '小熊 Melo',
        motto: '交替踏步踮脚，像小熊泵水一样加速血液循环与消肿！'
      };
    }
    if (exName.includes('☕') || exName.includes('咖啡') || exName.includes('扩胸')) {
      return {
        idleEmoji: '☕',
        runningEmoji: '🐾',
        completedEmoji: '🥳',
        name: '咖啡萌宠',
        motto: '利用接水与咖啡等待间隙，向上拉伸展开前胸与胸椎！'
      };
    }
    if (exName.includes('龟颈') || exName.includes('下巴') || exName.includes('颈')) {
      return {
        idleEmoji: '🐢',
        runningEmoji: '🐢',
        completedEmoji: '🎉',
        name: '龟龟矫正官',
        motto: '收下巴对准后颈，告别低头前倾，脖子变得好轻松！'
      };
    }
    if (exName.includes('手腕') || exName.includes('腕') || exName.includes('前臂') || exName.includes('大鱼际') || exName.includes('鼠标手')) {
      return {
        idleEmoji: '🐾',
        runningEmoji: '🐾',
        completedEmoji: '✨',
        name: 'Melo 爪爪',
        motto: '给劳累的打字手腕与前臂做个舒缓SPA~'
      };
    }
    return {
      idleEmoji: '🐾',
      runningEmoji: '🐶',
      completedEmoji: '🥳',
      name: 'Melo 萌宠',
      motto: '保持自然深呼吸，感受肌肉温和舒展~'
    };
  };

  const mascot = getMascotCompanion(exercise.name);

  // Reset state when exercise changes
  useEffect(() => {
    setTimeLeft(exercise.durationSeconds);
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    hasLoggedRef.current = false;
  }, [exercise]);

  // Timer interval tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playTickSound();
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, soundEnabled]);

  // Handle completion when timer reaches 0
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      if (soundEnabled) playChimeSound();

      if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
        saveUserLog({
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          durationSeconds: exercise.durationSeconds,
          muscleName: exercise.primaryMuscleName
        });
        if (onComplete) onComplete();
      }
    }
  }, [timeLeft, isRunning, soundEnabled, exercise, onComplete]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(exercise.durationSeconds);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    hasLoggedRef.current = false;
  };

  const handleManualComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
    if (soundEnabled) playChimeSound();

    if (!hasLoggedRef.current) {
      hasLoggedRef.current = true;
      const elapsed = Math.max(1, exercise.durationSeconds - timeLeft);
      saveUserLog({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        durationSeconds: elapsed,
        muscleName: exercise.primaryMuscleName
      });
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-emerald-100 my-4 animate-fadeIn select-none">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6 border-b border-emerald-50 pb-4">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-emerald-50 transition-all text-xs border border-gray-100 cursor-pointer"
            title={soundEnabled ? '音效开启' : '静音'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          <button
            onClick={() => onToggleFavorite(exercise.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isFav
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            <span>{isFav ? '已加入方案 ❤️' : '加入我的方案'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timer & Controls */}
        <div className="md:col-span-5 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-white p-6 rounded-3xl border border-emerald-100 flex flex-col items-center text-center relative overflow-hidden shadow-2xs">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2 border border-emerald-200/60 shadow-2xs">
            📍 目标肌肉：{exercise.primaryMuscleName}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">
            {exercise.name}
          </h2>

          <p className="text-xs text-gray-500 mb-5 font-medium">
            建议：{exercise.suggestedSets} | 工具：{exercise.equipment}
          </p>

          {/* Cute Countdown Clock Display */}
          <div className="relative w-48 h-48 my-2 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                className="stroke-emerald-100 stroke-[12] fill-none"
              />
              <circle
                cx="96"
                cy="96"
                r="84"
                className="stroke-emerald-600 stroke-[12] fill-none transition-all duration-1000 ease-linear"
                strokeDasharray={527}
                strokeDashoffset={527 - (527 * (exercise.durationSeconds - timeLeft)) / exercise.durationSeconds}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-3xl animate-pulse">
                {isCompleted ? mascot.completedEmoji : isRunning ? mascot.runningEmoji : mascot.idleEmoji}
              </span>
              <span className="text-4xl font-black tracking-tight text-emerald-950 font-mono">
                {timeLeft}s
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">
                {isRunning ? `${mascot.name} 陪练中...` : isCompleted ? '打卡成功！' : `${mascot.name} 随时准备`}
              </span>
            </div>
          </div>

          {/* Cute Mascot Companion Banner */}
          <div className="my-2 px-3.5 py-2 bg-amber-50/90 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 font-bold flex items-center justify-center gap-1.5 shadow-2xs">
            <span className="text-sm shrink-0">{mascot.idleEmoji}</span>
            <span>{mascot.name} 伴练：『{mascot.motto}』</span>
          </div>

          {/* Celebratory Message Box if completed */}
          {isCompleted && (
            <div className="my-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold animate-bounce flex items-center gap-2 shadow-2xs">
              <PartyPopper className="w-4 h-4 text-amber-600 shrink-0" />
              <span>(๑•̀ㅂ•́)w 太棒啦！肌肉正在开心地向你招手~</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4 w-full">
            {!isCompleted ? (
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> 暂停倒计时
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> 开始放松倒计时
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 py-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs border border-emerald-200/60">
                <Sparkles className="w-4 h-4 text-emerald-600" /> 已自动归档到今日健康日志！
              </div>
            )}

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer"
              title="重新开始"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {!isCompleted && (
            <button
              onClick={handleManualComplete}
              className="mt-3 text-xs text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              提前做好了？点击直接打卡 ✨
            </button>
          )}
        </div>

        {/* Right Column: Step-by-Step Breakdown & Visual Posture Guide */}
        <div className="md:col-span-7 space-y-4">
          {/* Header & Mode Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>姿势跟练指南</span>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200/60 text-xs">
              <button
                onClick={() => setViewMode('illustration')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'illustration' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                发力 Tips 💡
              </button>
              <button
                onClick={() => setViewMode('steps')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'steps' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                文字分步 📖
              </button>
            </div>
          </div>

          {/* Action Tips & Intuitive Mental Guidance */}
          {viewMode === 'illustration' && (
            <PostureIllustration exercise={exercise} currentStepIndex={currentStepIndex} />
          )}

          {/* Step-by-Step Text Breakdown */}
          {viewMode === 'steps' && (
            <div>
              <h3 className="text-sm font-extrabold text-gray-800 mb-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>动作分步要领</span>
              </h3>

              <div className="space-y-2.5">
                {exercise.steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      currentStepIndex === idx
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs ring-1 ring-emerald-300'
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                        {stepEmojis[idx % stepEmojis.length]}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                        步骤 {step.stepNumber}: {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pl-7">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precautions Box */}
          {exercise.cautions && exercise.cautions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
              <h4 className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>注意事项 & 防伤特别提示</span>
              </h4>
              <ul className="space-y-1">
                {exercise.cautions.map((c, idx) => (
                  <li key={idx} className="text-xs text-amber-800 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Benefits Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white text-xs leading-relaxed shadow-2xs">
            <span className="font-bold text-amber-300">✨ Melo 舒缓效果：</span>
            {exercise.benefits}
          </div>
        </div>
      </div>
    </div>
  );
};
