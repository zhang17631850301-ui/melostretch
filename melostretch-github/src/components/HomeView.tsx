import React, { useState } from 'react';
import { MuscleInfo, Exercise, SolutionRoutine } from '../types';
import { MUSCLES_LIST, OFFICE_SOLUTIONS, EXERCISES_DATABASE } from '../data/meloStretchData';
import { 
  Sparkles, Map, Play, Clock, Flame, Shield, ArrowRight, Heart, Activity, 
  Smile, Zap, Coffee, Award, ThumbsUp, HeartHandshake, CheckCircle2, Sparkle,
  Sun, Gift, SmilePlus, ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  onGoToBodyMap: () => void;
  onSelectMuscle: (m: MuscleInfo) => void;
  onStartExercise: (ex: Exercise) => void;
  onSelectSolution: (sol: SolutionRoutine) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  streakDays: number;
  totalMinutes: number;
}

// Cute Sprout Mascot Character SVG Component
const MeloSproutMascot: React.FC<{ expression?: 'happy' | 'wink' | 'love'; onClick?: () => void }> = ({ 
  expression = 'happy',
  onClick 
}) => (
  <div 
    onClick={onClick}
    className="relative group cursor-pointer select-none transition-transform hover:scale-110 active:scale-95"
    title="点击和 Melo 舒缓小精灵互动！"
  >
    <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg">
      {/* Headband Sprout Leaves */}
      <path d="M 60 22 C 48 8, 28 14, 38 30 C 45 34, 55 28, 60 22 Z" fill="#34d399" />
      <path d="M 60 22 C 72 8, 92 14, 82 30 C 75 34, 65 28, 60 22 Z" fill="#10b981" />
      
      {/* Body */}
      <ellipse cx="60" cy="68" rx="36" ry="32" fill="#6ee7b7" />
      <ellipse cx="60" cy="70" rx="30" ry="26" fill="#a7f3d0" opacity="0.6" />
      
      {/* Blushing Cheeks */}
      <circle cx="40" cy="72" r="6.5" fill="#f87171" opacity="0.75" />
      <circle cx="80" cy="72" r="6.5" fill="#f87171" opacity="0.75" />
      
      {/* Eyes */}
      {expression === 'wink' ? (
        <>
          <path d="M 38 66 Q 44 60 50 66" stroke="#064e3b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="74" cy="65" r="4.5" fill="#064e3b" />
          <circle cx="76" cy="63" r="1.8" fill="#ffffff" />
        </>
      ) : expression === 'love' ? (
        <>
          <path d="M 40 68 Q 44 60 48 68" stroke="#ef4444" strokeWidth="3" fill="none" />
          <path d="M 72 68 Q 76 60 80 68" stroke="#ef4444" strokeWidth="3" fill="none" />
        </>
      ) : (
        <>
          <circle cx="44" cy="65" r="4.5" fill="#064e3b" />
          <circle cx="46" cy="63" r="1.8" fill="#ffffff" />
          <circle cx="76" cy="65" r="4.5" fill="#064e3b" />
          <circle cx="78" cy="63" r="1.8" fill="#ffffff" />
        </>
      )}

      {/* Smiling Mouth */}
      <path d="M 53 74 Q 60 82 67 74" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Yellow Sports Headband */}
      <path d="M 28 56 Q 60 50 92 56" stroke="#fbbf24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <circle cx="84" cy="52" r="4" fill="#ef4444" />

      {/* Tiny Waving Arms */}
      <ellipse cx="20" cy="72" rx="7" ry="4.5" fill="#34d399" transform="rotate(-25 20 72)" />
      <ellipse cx="100" cy="72" rx="7" ry="4.5" fill="#34d399" transform="rotate(25 100 72)" />
    </svg>

    {/* Sparkle badge */}
    <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-[10px] font-black shadow-xs animate-pulse">
      ✨
    </span>
  </div>
);

// Cute Custom Symptom Badges with playful icons
const CUTE_SYMPTOM_TAGS = [
  { tag: '肩颈沉重酸胀', icon: '🦒', label: '长颈鹿救颈', muscleId: 'upper_trapezius', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { tag: '转头刺痛落枕感', icon: '🌸', label: '花朵舒展', muscleId: 'levator_scapulae', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { tag: '前颈紧绷前倾脖', icon: '🐢', label: '告别乌龟颈', muscleId: 'sternocleidomastoid', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  { tag: '上背中间隐痛', icon: '🐣', label: '小鸡夹翅膀', muscleId: 'rhomboids', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { tag: '含胸圆肩驼背', icon: '🧸', label: '小熊挺胸', muscleId: 'pectoralis_major', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { tag: '久坐腰酸直不起', icon: '🔋', label: '腰椎充满电', muscleId: 'erector_spinae', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { tag: '单侧下腰酸痛', icon: '☕', label: '咖啡拉伸间隙', muscleId: 'quadratus_lumborum', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { tag: '鼠标手手腕酸痛', icon: '🐱', label: '猫爪揉手腕', muscleId: 'wrist_extensors', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { tag: '手掌大拇指发僵', icon: '⌨️', label: '键盘手救星', muscleId: 'intrinsic_hand', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { tag: '臀部深层发麻', icon: '🍑', label: '蜜桃臀激活', muscleId: 'piriformis', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  { tag: '大腿后侧僵硬', icon: '🦩', label: '火烈鸟长腿', muscleId: 'hamstrings', color: 'bg-lime-50 text-lime-800 border-lime-200' },
  { tag: '下午小腿肿胀', icon: '⚡', label: '小腿极速泵血', muscleId: 'gastrocnemius_soleus', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' }
];

// Cute Micro Office Stretches
const CUTE_DESK_MINI_STRETCHES = [
  {
    title: '☕ 咖啡等待拉伸',
    time: '60秒',
    icon: '☕',
    benefit: '等咖啡沸腾时双手上举，舒缓胸椎与背部',
    exerciseId: 'ex_door_chest',
    muscleId: 'pectoralis_major'
  },
  {
    title: '🐱 猫咪抱臂拱背',
    time: '60秒',
    icon: '🐱',
    benefit: '椅上抱臂向前拱背，解锁上背与肩胛骨酸痛',
    exerciseId: 'ex_chest_hug_stretch',
    muscleId: 'rhomboids'
  },
  {
    title: '🐣 小鸡翅膀夹紧',
    time: '40秒',
    icon: '🐣',
    benefit: '双手扣头后两侧胳膊用力向后夹，改善圆肩',
    exerciseId: 'ex_wall_w_squeeze',
    muscleId: 'middle_lower_trapezius'
  },
  {
    title: '🐾 小熊垫脚泵血',
    time: '40秒',
    icon: '🐾',
    benefit: '坐姿快速交替踮脚尖，改善下肢循环与脚发麻',
    exerciseId: 'ex_calf_pump_and_stretch',
    muscleId: 'gastrocnemius_soleus'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onGoToBodyMap,
  onSelectMuscle,
  onStartExercise,
  onSelectSolution,
  favorites,
  onToggleFavorite,
  streakDays,
  totalMinutes
}) => {
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState(0);
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'wink' | 'love'>('happy');
  const [showHeartToast, setShowHeartToast] = useState(false);

  const MASCOT_QUOTES = [
    `"(⁠๑⁠•⁠̀⁠f⁠•⁠́⁠)⁠و 已经连续打卡 ${streakDays} 天啦！肌肉开心地伸了个大懒腰~"`,
    `"(⁠⁠*⁠´⁠∀⁠｀⁠*⁠) 累了吗？摸摸脖子和肩膀，陪你舒展 3 分钟吧！"`,
    `"☕ 记得喝口水，挺直小腰板，今天也是能量满满的工位星人！"`,
    `"✨ 肌肉疲劳已被 Melo 排查完毕，点击【身体地图】立刻拯救不适！"`
  ];

  const handleMascotClick = () => {
    setMascotQuoteIndex((prev) => (prev + 1) % MASCOT_QUOTES.length);
    setMascotExpression((prev) => (prev === 'happy' ? 'wink' : prev === 'wink' ? 'love' : 'happy'));
    setShowHeartToast(true);
    setTimeout(() => setShowHeartToast(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-8 select-none">
      {/* Cute Interactive Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-9 text-white shadow-lg border border-emerald-500/30">
        
        {/* Subtle decorative background cute elements */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-36 top-2 w-36 h-36 bg-amber-300/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute left-1/2 top-4 -translate-x-1/2 text-white/5 text-8xl font-black pointer-events-none">
          ✨ 🌿 🐾
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            {/* Cute Badge Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold backdrop-blur-xs border border-white/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Melo 舒缓助手 · 陪伴你的工位健康</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                可爱的工位救星 🐾
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              今日哪里酸痛啦？<br className="hidden sm:inline" />
              <span className="text-amber-200">Melo 陪你动一动 ✨</span>
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed opacity-95">
              不用硬撑！点击【身体地图】精准找出劳损点位，用 3~5 分钟工位极速舒缓拯救肩颈与久坐麻木。
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onGoToBodyMap}
                className="px-6 py-3 bg-white text-emerald-850 font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 group active:scale-95"
              >
                <Map className="w-4 h-4 text-emerald-600" />
                <span>探索身体地图</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectSolution(OFFICE_SOLUTIONS[0])}
                className="px-5 py-3 bg-emerald-800/90 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl border border-emerald-400/40 transition-all flex items-center gap-2 active:scale-95 shadow-2xs"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>3 分钟极速肩颈救急</span>
              </button>
            </div>
          </div>

          {/* Cute Mascot Interactive Widget Card */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center max-w-xs w-full shadow-md hover:bg-white/15 transition-all">
            <MeloSproutMascot expression={mascotExpression} onClick={handleMascotClick} />

            {/* Speech Bubble */}
            <div className="mt-2 bg-white text-gray-800 p-2.5 rounded-2xl text-xs font-bold shadow-md relative animate-fadeIn border border-amber-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-amber-200" />
              <p className="leading-snug text-emerald-950">
                {MASCOT_QUOTES[mascotQuoteIndex]}
              </p>
            </div>

            <p className="text-[10px] text-emerald-200/90 mt-2 font-medium flex items-center gap-1">
              <span>👆 点击和小精灵互动加满能量！</span>
            </p>

            {/* Heart Particle Toast Effect */}
            {showHeartToast && (
              <div className="absolute -top-3 right-2 bg-amber-400 text-amber-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1 border border-white">
                <span>💖 能量 +100%!</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Quick Stats Badges Row with Cute Icons */}
        <div className="mt-7 pt-5 border-t border-emerald-500/30 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2.5 bg-emerald-800/40 p-2.5 rounded-2xl border border-emerald-400/20">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-base">
              🔥
            </div>
            <div>
              <p className="text-[11px] text-emerald-200">连续打卡拉伸</p>
              <p className="text-xs sm:text-sm font-bold text-white">{streakDays} 天活力满格</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-800/40 p-2.5 rounded-2xl border border-emerald-400/20">
            <div className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-200 flex items-center justify-center font-bold text-base">
              ⏱️
            </div>
            <div>
              <p className="text-[11px] text-emerald-200">累计排查放松</p>
              <p className="text-xs sm:text-sm font-bold text-white">{totalMinutes} 分钟肌肉放松</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-800/40 p-2.5 rounded-2xl border border-emerald-400/20 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-200 flex items-center justify-center font-bold text-base">
              🛡️
            </div>
            <div>
              <p className="text-[11px] text-emerald-200">身体健康区域</p>
              <p className="text-xs sm:text-sm font-bold text-white">22 处核心肌肉守护</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cute Desk Mini-Stretches Quick Row */}
      <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <h2 className="text-sm sm:text-base font-bold text-amber-950">
              工位萌宠 1 分钟微舒缓（随时极速充电）
            </h2>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            极简易操作
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {CUTE_DESK_MINI_STRETCHES.map((item, idx) => {
            const matchedExercise = EXERCISES_DATABASE.find((e) => e.id === item.exerciseId);
            const matchedMuscle = MUSCLES_LIST.find((m) => m.id === item.muscleId);
            return (
              <div
                key={idx}
                onClick={() => {
                  if (matchedExercise) {
                    onStartExercise(matchedExercise);
                  } else if (matchedMuscle) {
                    onSelectMuscle(matchedMuscle);
                  }
                }}
                className="bg-white rounded-2xl p-3.5 border border-amber-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-2 group active:scale-95"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {item.time}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">
                    {item.benefit}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 pt-2 border-t border-amber-50">
                  <span>跟练动作</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-amber-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symptom Quick Filter Row with Cute Badges */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="text-base">🏷️</span>
            <span>按常见症状点选（可爱图解直达）：</span>
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">点击一键定位</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CUTE_SYMPTOM_TAGS.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                const targetMuscle = MUSCLES_LIST.find((m) => m.id === item.muscleId);
                if (targetMuscle) {
                  onSelectMuscle(targetMuscle);
                }
              }}
              className={`p-3 rounded-2xl ${item.color} border text-left transition-all flex items-center justify-between gap-2 group cursor-pointer hover:shadow-xs active:scale-95`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold opacity-70 tracking-tight">
                    {item.label}
                  </p>
                  <p className="text-xs font-bold truncate">
                    {item.tag}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Office Solutions Presets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-xl">🎒</span>
              <span>办公室四大场景方案</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              无需离开座位，3~5 分钟连贯舒缓整套流程
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICE_SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              onClick={() => onSelectSolution(sol)}
              className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sol.tagColor}`}>
                    {sol.category}
                  </span>
                  <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {sol.durationMinutes} 分钟
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  <span>{sol.title}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {sol.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span className="flex items-center gap-1">
                  <span>开启连贯练习</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
