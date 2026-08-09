import React, { useState, useMemo } from 'react';
import { Exercise, UserLog, UserStats } from '../types';
import { EXERCISES_DATABASE } from '../data/meloStretchData';
import { saveUserLog, deleteUserLog } from '../utils/storage';
import { 
  Heart, Calendar, CheckCircle2, Flame, Clock, Play, Trash2, Award, 
  Sparkles, Plus, RefreshCw, Layers, Search, ArrowUp, ArrowDown, X, PlusCircle, Check,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface MyPlanViewProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onStartExercise: (ex: Exercise) => void;
  allExercises?: Exercise[];
  logs: UserLog[];
  stats: UserStats;
  onRefreshData?: () => void;
}

export const MyPlanView: React.FC<MyPlanViewProps> = ({
  favorites,
  onToggleFavorite,
  onStartExercise,
  allExercises = EXERCISES_DATABASE,
  logs,
  stats,
  onRefreshData
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual log state
  const [selectedExForLog, setSelectedExForLog] = useState<string>(allExercises[0]?.id || '');
  const [manualDurationMinutes, setManualDurationMinutes] = useState<number>(3);

  // Calendar View State
  const nowObj = new Date();
  const currentTodayYear = nowObj.getFullYear();
  const currentTodayMonth = nowObj.getMonth();
  const currentTodayDay = nowObj.getDate();
  const currentTodayStr = `${currentTodayYear}-${String(currentTodayMonth + 1).padStart(2, '0')}-${String(currentTodayDay).padStart(2, '0')}`;

  const [calYear, setCalYear] = useState<number>(currentTodayYear);
  const [calMonth, setCalMonth] = useState<number>(currentTodayMonth);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(currentTodayStr);
  const [manualLogDate, setManualLogDate] = useState<string>(currentTodayStr);

  const handleOpenLogModal = (overrideDate?: string) => {
    setManualLogDate(overrideDate || selectedDateStr || currentTodayStr);
    setShowLogModal(true);
  };

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(y => y - 1);
    } else {
      setCalMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(y => y + 1);
    } else {
      setCalMonth(m => m + 1);
    }
  };

  const handleGoToday = () => {
    setCalYear(currentTodayYear);
    setCalMonth(currentTodayMonth);
    setSelectedDateStr(currentTodayStr);
  };

  // Group logs by date
  const logsByDateMap = useMemo(() => {
    const map: Record<string, UserLog[]> = {};
    logs.forEach((log) => {
      const dStr = log.dateStr || currentTodayStr;
      if (!map[dStr]) map[dStr] = [];
      map[dStr].push(log);
    });
    return map;
  }, [logs, currentTodayStr]);

  const selectedDayLogs = logsByDateMap[selectedDateStr] || [];

  // Monthly calendar calculation
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayRaw = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
  const startOffset = (firstDayRaw + 6) % 7; // Monday = 0

  // Map favorite IDs to full exercise objects
  const planExercises = favorites
    .map((id) => allExercises.find((ex) => ex.id === id))
    .filter((ex): ex is Exercise => Boolean(ex));

  // Total plan duration calculation
  const totalPlanSeconds = planExercises.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const totalPlanMinStr = `${Math.floor(totalPlanSeconds / 60)}分${totalPlanSeconds % 60 ? (totalPlanSeconds % 60) + '秒' : ''}`;

  // Helper for human-friendly duration formatting (e.g. 1分40秒 instead of 100秒)
  const formatDurationText = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '0秒';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}秒`;
    if (secs === 0) return `${mins}分钟`;
    return `${mins}分${secs}秒`;
  };

  const getRelativeDateLabel = (dateStr: string): string => {
    if (!dateStr) return '';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const yest = new Date(Date.now() - 86400000);
    const yYear = yest.getFullYear();
    const yMonth = String(yest.getMonth() + 1).padStart(2, '0');
    const yDay = String(yest.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    if (dateStr === todayStr) return `今天 (${dateStr})`;
    if (dateStr === yesterdayStr) return `昨天 (${dateStr})`;
    return dateStr;
  };

  // Filter exercises for Add Modal
  const modalExercises = allExercises.filter(ex => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.primaryMuscleName.toLowerCase().includes(q) ||
      ex.benefits.toLowerCase().includes(q)
    );
  });

  // Handle Manual Log Submission
  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEx = allExercises.find(ex => ex.id === selectedExForLog) || allExercises[0];
    if (!targetEx) return;

    const targetDate = manualLogDate || selectedDateStr || currentTodayStr;

    saveUserLog({
      exerciseId: targetEx.id,
      exerciseName: targetEx.name,
      durationSeconds: manualDurationMinutes * 60,
      muscleName: targetEx.primaryMuscleName,
      dateStr: targetDate
    });

    // Automatically navigate calendar view to selected date so user sees their new punch-in
    setSelectedDateStr(targetDate);
    const [y, m] = targetDate.split('-').map(Number);
    if (y && m) {
      setCalYear(y);
      setCalMonth(m - 1);
    }

    if (onRefreshData) onRefreshData();
    setShowLogModal(false);
  };

  const handleDeleteLogItem = (logId: string) => {
    deleteUserLog(logId);
    if (onRefreshData) onRefreshData();
  };

  // Re-order favorites in localStorage
  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === favorites.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newFavs = [...favorites];
    const temp = newFavs[index];
    newFavs[index] = newFavs[targetIndex];
    newFavs[targetIndex] = temp;

    // Save to local storage
    localStorage.setItem('melostretch_favorites', JSON.stringify(newFavs));
    if (onRefreshData) onRefreshData();
  };

  const handleResetDefaultPlan = () => {
    const defaults = ['ex_neck_side', 'ex_seated_figure_4', 'ex_seated_twist', 'ex_wrist_stretch'];
    localStorage.setItem('melostretch_favorites', JSON.stringify(defaults));
    if (onRefreshData) onRefreshData();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Top Banner & Comprehensive Stats Dashboard */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-6 relative overflow-hidden">
        <div className="absolute right-4 top-2 text-white/10 text-9xl font-black pointer-events-none">
          🌱 🏆
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold backdrop-blur-xs mb-2 border border-white/20">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>自定义工位方案与萌宠健康统计</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                活力满满 🐾
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              我的工位健康大本营 ✨
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              自由编排专属拉伸序列，Melo 陪你实时记录每一次工位微运动~
            </p>
          </div>
        </div>

        {/* 4 Key Metric Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/20 p-4 rounded-2xl border border-white/20 backdrop-blur-xs relative z-10">
          <div className="text-center p-2 border-r border-white/10 last:border-0 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-emerald-200 text-xs justify-center font-bold">
              <Layers className="w-3.5 h-3.5" /> 累计打卡
            </div>
            <p className="text-xl sm:text-2xl font-black mt-1 font-mono text-white">
              {stats.totalSessions} <span className="text-xs font-normal text-emerald-100">次</span>
            </p>
            <p className="text-[10px] text-amber-300 mt-0.5">🌱 历史完成练习总次数</p>
          </div>

          <div className="text-center p-2 border-r border-white/10 last:border-0 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-emerald-200 text-xs justify-center font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-300" /> 累计放松时间
            </div>
            <p className="text-xl sm:text-2xl font-black mt-1 font-mono text-white">
              {formatDurationText(stats.totalSeconds ?? 0)}
            </p>
            <p className="text-[10px] text-emerald-200/90 mt-0.5">🌱 历史全套跟练总时长</p>
          </div>

          <div className="text-center p-2 border-r border-white/10 last:border-0 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-amber-300 text-xs justify-center font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-300" /> 连续坚持
            </div>
            <p className="text-xl sm:text-2xl font-black mt-1 font-mono text-amber-300">
              {stats.streakDays} <span className="text-xs font-normal text-white">天</span>
            </p>
            <p className="text-[10px] text-amber-200 mt-0.5">🔥 连续按日打卡天数</p>
          </div>

          <div className="text-center p-2 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-teal-200 text-xs justify-center font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" /> 今日战绩
            </div>
            <p className="text-xl sm:text-2xl font-black mt-1 font-mono text-white">
              {stats.todaySessions || 0} <span className="text-xs font-normal text-emerald-100">次</span>
            </p>
            <p className="text-[10px] text-teal-100/90 mt-0.5">
              今日已练 {formatDurationText(stats.todaySeconds ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Custom Office Plan Editor, Right Training Log Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: My Custom Office Plan */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-50">
            <div>
              <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>我的专属工位方案 ({planExercises.length} 个动作)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                完整连贯跟练预估耗时：<span className="font-bold text-emerald-700">{totalPlanMinStr}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>动作库挑选</span>
              </button>

              <button
                onClick={handleResetDefaultPlan}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 text-xs transition-all border border-gray-100"
                title="重置默认推荐方案"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Start Full Plan Button */}
          {planExercises.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  ▶
                </span>
                <div>
                  <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    <span>一键开启全套工位舒缓序列</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </h3>
                  <p className="text-[11px] text-emerald-700">按照您自定义的顺序顺畅进行放松</p>
                </div>
              </div>

              <button
                onClick={() => onStartExercise(planExercises[0])}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>立即跟练首项</span>
              </button>
            </div>
          )}

          {/* Plan Exercise List */}
          <div className="space-y-3">
            {planExercises.map((ex, index) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/40 border border-gray-100 hover:border-emerald-200 flex items-center justify-between gap-3 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        📍 {ex.primaryMuscleName}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        • {ex.suggestedSets} ({ex.durationSeconds}秒)
                      </span>
                      {ex.isAiGenerated && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold border border-amber-300">AI</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">
                      {ex.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveExercise(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-emerald-100 rounded text-gray-500 disabled:opacity-20"
                      title="上移"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveExercise(index, 'down')}
                      disabled={index === planExercises.length - 1}
                      className="p-1 hover:bg-emerald-100 rounded text-gray-500 disabled:opacity-20"
                      title="下移"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(ex.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all ml-1 cursor-pointer"
                    title="从方案移除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onStartExercise(ex)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1 ml-1 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>跟练</span>
                  </button>
                </div>
              </div>
            ))}

            {planExercises.length === 0 && (
              <div className="p-8 text-center bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200 text-gray-500 text-sm space-y-3">
                <span className="text-3xl">🌱</span>
                <p className="font-bold text-emerald-950">方案暂时为空</p>
                <p className="text-xs text-gray-400">点击【动作库挑选】或在“身体地图”中选择动作加入方案吧！</p>
                <button
                  onClick={handleResetDefaultPlan}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs inline-block hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  一键导入标准工位推荐方案 ☕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Monthly Punch-in Calendar & Selected Day Logs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
          {/* Header & Month Navigator */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-50">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>当月打卡日历</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGoToday}
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all cursor-pointer active:scale-95"
              >
                回到今天
              </button>
            </div>
          </div>

          {/* Month Control Bar */}
          <div className="flex items-center justify-between bg-emerald-50/60 p-2 rounded-2xl border border-emerald-100/80">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all cursor-pointer active:scale-95"
              title="上一个月"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-emerald-950 font-mono">
              {calYear} 年 {calMonth + 1} 月
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all cursor-pointer active:scale-95"
              title="下一个月"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Grid Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-gray-400 py-1 border-b border-gray-100">
            {['一', '二', '三', '四', '五', '六', '日'].map((w, idx) => (
              <span key={idx} className={idx >= 5 ? 'text-amber-600/80' : ''}>{w}</span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Blank offsets */}
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`offset_${idx}`} className="h-10 sm:h-12 rounded-xl bg-gray-50/40 opacity-30" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayLogs = logsByDateMap[dateStr] || [];
              const hasLogs = dayLogs.length > 0;
              const isToday = dateStr === currentTodayStr;
              const isSelected = dateStr === selectedDateStr;

              return (
                <button
                  key={`day_${dayNum}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-11 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-between font-mono font-bold transition-all relative cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-102 z-10'
                      : isToday
                      ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500 font-black'
                      : hasLogs
                      ? 'bg-emerald-50/90 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <span className="text-xs leading-none mt-0.5">{dayNum}</span>
                  {hasLogs ? (
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded-md font-sans font-black flex items-center gap-0.5 ${
                        isSelected
                          ? 'bg-amber-300 text-amber-950'
                          : 'bg-emerald-200/80 text-emerald-900'
                      }`}
                    >
                      🌱 {dayLogs.length}
                    </span>
                  ) : (
                    <span className="text-[9px] opacity-20">•</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Log Details Section */}
          <div className="mt-4 pt-3 border-t border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
                <span className="text-emerald-600">📅</span>
                <span>{getRelativeDateLabel(selectedDateStr)} 打卡纪录 ({selectedDayLogs.length} 次)</span>
              </h3>
              <button
                onClick={() => handleOpenLogModal(selectedDateStr)}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 手动补记
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {selectedDayLogs.map((log, idx) => (
                <div
                  key={log.id ? `${log.id}_${idx}` : `log_${idx}`}
                  className="p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/40 border border-gray-100 flex items-center justify-between text-xs transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      🌱
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs">
                        {log.exerciseName}
                      </h4>
                      <p className="text-gray-400 text-[10px] mt-0.5 font-medium">
                        {log.muscleName || '工位拉伸'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      +{log.durationSeconds}s
                    </span>
                    <button
                      onClick={() => handleDeleteLogItem(log.id)}
                      className="p-1 text-gray-300 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      title="删除此条打卡"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {selectedDayLogs.length === 0 && (
                <div className="p-6 text-center bg-gray-50/80 rounded-2xl text-gray-400 text-xs space-y-1 border border-dashed border-gray-200">
                  <span className="text-2xl block">☕</span>
                  <p className="font-bold text-gray-600">该日期尚无打卡记录</p>
                  <p className="text-[11px] text-gray-400">选择动作开始练习，或点击右上角“手动补记”吧！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add Exercise from Library to Plan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  添加动作到我的工位方案
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">勾选或取消勾选动作，自定义专属工位放松组合</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索动作名称、舒缓肌肉或关键字..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {modalExercises.map((ex) => {
                const inPlan = favorites.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => onToggleFavorite(ex.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      inPlan
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          📍 {ex.primaryMuscleName}
                        </span>
                        <span className="text-xs text-gray-500">
                          工具：{ex.equipment}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800">{ex.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{ex.benefits}</p>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                        inPlan
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                      }`}
                    >
                      {inPlan ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>已加入</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>加入方案</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-emerald-50 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                完成选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Manual Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={handleSaveManualLog}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                手动补记一次练习
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              工位自发拉伸或未开启系统倒计时？在这里补充记录，系统将自动汇总计算到您的总练习时间与次数中。
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">补记打卡日期</label>
                <input
                  type="date"
                  value={manualLogDate}
                  onChange={(e) => setManualLogDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">选择拉伸动作/部位</label>
                <select
                  value={selectedExForLog}
                  onChange={(e) => setSelectedExForLog(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      [{ex.primaryMuscleName}] {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">实际练习时长（分钟）</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={manualDurationMinutes}
                  onChange={(e) => setManualDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                保存打卡记录
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
