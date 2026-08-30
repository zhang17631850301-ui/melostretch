import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { BodyMap } from './components/BodyMap';
import { MuscleDetailModal } from './components/MuscleDetailModal';
import { ExercisePracticeView } from './components/ExercisePracticeView';
import { SolutionsView } from './components/SolutionsView';
import { MyPlanView } from './components/MyPlanView';
import { MuscleInfo, Exercise, SolutionRoutine, UserLog, UserStats } from './types';
import { MUSCLES_LIST, EXERCISES_DATABASE, OFFICE_SOLUTIONS } from './data/meloStretchData';
import { getFavorites, toggleFavorite, getUserLogs, getUserStats, getAiExercises, saveAiExercisesBatch } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleInfo | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [aiExercises, setAiExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    todaySessions: 0,
    todayMinutes: 0,
    todaySeconds: 0,
    streakDays: 0,
    lastActiveDate: ''
  });

  // Load user data on mount
  useEffect(() => {
    const refreshFromStorage = () => {
      setFavorites(getFavorites());
      setLogs(getUserLogs());
      setStats(getUserStats());
      setAiExercises(getAiExercises());
    };

    refreshFromStorage();
    window.addEventListener('melostretch:data-changed', refreshFromStorage);
    window.addEventListener('melostretch:local-data-changed', refreshFromStorage);
    return () => {
      window.removeEventListener('melostretch:data-changed', refreshFromStorage);
      window.removeEventListener('melostretch:local-data-changed', refreshFromStorage);
    };
  }, []);

  const allExercises = [...EXERCISES_DATABASE, ...aiExercises];

  const handleAddAiExercise = (newEx: Exercise) => {
    setAiExercises(prev => {
      if (prev.some(e => e.id === newEx.id)) return prev;
      const updated = [newEx, ...prev];
      saveAiExercisesBatch([newEx]);
      return updated;
    });
  };

  // Sync state after completing exercise
  const handleExerciseComplete = () => {
    setLogs(getUserLogs());
    setStats(getUserStats());
  };

  const handleToggleFavorite = (exerciseId: string) => {
    const updated = toggleFavorite(exerciseId);
    setFavorites(updated);
  };

  // Open muscle detail modal
  const handleSelectMuscle = (muscle: MuscleInfo) => {
    setSelectedMuscle(muscle);
  };

  const handleCloseMuscleModal = () => {
    setSelectedMuscle(null);
  };

  // Find exercises recommended for selected muscle (including AI expanded ones)
  const recommendedExercises = selectedMuscle
    ? allExercises.filter(ex => ex.targetMuscleIds.includes(selectedMuscle.id))
    : [];

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedMuscle(null);
    setActiveExercise(exercise);
  };

  const handleQuick3Min = () => {
    const quickEx = EXERCISES_DATABASE.find(ex => ex.id === 'ex_neck_side') || EXERCISES_DATABASE[0];
    if (quickEx) {
      setActiveExercise(quickEx);
    }
  };

  const handleSelectSolution = (sol: SolutionRoutine) => {
    const firstExId = sol.exerciseIds[0];
    const firstEx = EXERCISES_DATABASE.find(ex => ex.id === firstExId);
    if (firstEx) {
      setActiveExercise(firstEx);
    } else {
      setActiveTab('solutions');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-gray-800 antialiased selection:bg-emerald-200">
      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveExercise(null);
          setActiveTab(tab);
        }}
        onQuick3Min={handleQuick3Min}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-12">
        {/* If practice mode active, prioritize showing Practice Player */}
        {activeExercise ? (
          <ExercisePracticeView
            exercise={activeExercise}
            onBack={() => setActiveExercise(null)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onComplete={handleExerciseComplete}
          />
        ) : (
          <>
            {/* View Switching */}
            {activeTab === 'home' && (
              <HomeView
                onGoToBodyMap={() => setActiveTab('bodymap')}
                onSelectMuscle={(m) => {
                  setSelectedMuscle(m);
                  setActiveTab('bodymap');
                }}
                onStartExercise={handleStartExercise}
                onSelectSolution={handleSelectSolution}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                streakDays={stats.streakDays}
                totalMinutes={stats.totalMinutes}
              />
            )}

            {activeTab === 'bodymap' && (
              <div className="space-y-6">
                <BodyMap
                  onSelectMuscle={handleSelectMuscle}
                  selectedMuscleId={selectedMuscle?.id}
                  onStartExercise={handleStartExercise}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              </div>
            )}

            {activeTab === 'solutions' && (
              <SolutionsView
                onStartExercise={handleStartExercise}
                onSelectSolution={handleSelectSolution}
              />
            )}

            {activeTab === 'plan' && (
              <MyPlanView
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onStartExercise={handleStartExercise}
                allExercises={allExercises}
                logs={logs}
                stats={stats}
                onRefreshData={handleExerciseComplete}
              />
            )}
          </>
        )}
      </main>

      {/* Muscle Detail Modal */}
      <MuscleDetailModal
        muscle={selectedMuscle}
        exercises={recommendedExercises}
        onClose={handleCloseMuscleModal}
        onStartExercise={handleStartExercise}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onAddAiExercise={handleAddAiExercise}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 text-center text-xs text-gray-400">
        <p className="font-semibold text-gray-500">
          MeloStretch 办公室肌肉舒缓助手 © {new Date().getFullYear()}
        </p>
        <p className="mt-1 text-[11px]">
          免责声明：本产品提供办公室肌肉放松及拉伸指导，非医疗诊疗软件。如出现严重剧烈发麻或持续撕裂痛，请及时就医。
        </p>
      </footer>
    </div>
  );
}
