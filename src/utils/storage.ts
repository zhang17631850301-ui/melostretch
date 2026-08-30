import { UserLog, UserStats } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'melostretch_favorites',
  LOGS: 'melostretch_logs',
  STATS: 'melostretch_stats',
  AI_EXERCISES: 'melostretch_ai_exercises',
};

function notifyLocalDataChanged(): void {
  window.dispatchEvent(new Event('melostretch:local-data-changed'));
}

/**
 * Returns local YYYY-MM-DD date string instead of UTC to avoid timezone shift bugs
 */
export function getLocalDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getAiExercises(): import('../types').Exercise[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AI_EXERCISES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAiExercisesBatch(newExercises: import('../types').Exercise[]): import('../types').Exercise[] {
  const existing = getAiExercises();
  const existingIds = new Set(existing.map(e => e.id));
  const toAdd = newExercises.filter(e => !existingIds.has(e.id));
  const updated = [...existing, ...toAdd];
  try {
    localStorage.setItem(STORAGE_KEYS.AI_EXERCISES, JSON.stringify(updated));
    notifyLocalDataChanged();
  } catch {
    // ignore
  }
  return updated;
}

export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : ['ex_neck_side', 'ex_seated_figure_4'];
  } catch {
    return ['ex_neck_side', 'ex_seated_figure_4'];
  }
}

export function toggleFavorite(exerciseId: string): string[] {
  const current = getFavorites();
  const index = current.indexOf(exerciseId);
  let updated: string[];
  if (index >= 0) {
    updated = current.filter(id => id !== exerciseId);
  } else {
    updated = [...current, exerciseId];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    notifyLocalDataChanged();
  } catch {
    // ignore
  }
  return updated;
}

export function getUserLogs(): UserLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) {
      return [];
    }
    const rawLogs: UserLog[] = JSON.parse(data);

    // Filter out seed IDs: log_seed_1, log_seed_2, log_seed_3
    const seedIds = new Set(['log_seed_1', 'log_seed_2', 'log_seed_3']);
    let hasCleanedSeed = false;
    const logsWithoutSeed = rawLogs.filter(log => {
      if (seedIds.has(log.id) || (log.id && log.id.startsWith('log_seed_'))) {
        hasCleanedSeed = true;
        return false;
      }
      return true;
    });

    const seenIds = new Set<string>();
    let idOrDateChanged = false;
    const formattedLogs = logsWithoutSeed.map((log, index) => {
      let id = log.id;
      if (!id || seenIds.has(id)) {
        id = `log_${log.timestamp || Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`;
        idOrDateChanged = true;
      }
      seenIds.add(id);

      // Preserve existing dateStr, fallback to timestamp or local today only if missing
      let dateStr = log.dateStr;
      if (!dateStr) {
        if (log.timestamp) {
          dateStr = getLocalDateStr(new Date(log.timestamp));
        } else {
          dateStr = getLocalDateStr();
        }
        idOrDateChanged = true;
      }

      return { ...log, id, dateStr };
    });

    // Deduplicate logs created within 3 seconds of each other for the same exercise
    const filteredLogs: UserLog[] = [];
    let deduplicated = false;
    for (const log of formattedLogs) {
      const isDuplicate = filteredLogs.some(existing => 
        existing.exerciseId === log.exerciseId &&
        existing.dateStr === log.dateStr &&
        Math.abs((existing.timestamp || 0) - (log.timestamp || 0)) < 3000
      );
      if (!isDuplicate) {
        filteredLogs.push(log);
      } else {
        deduplicated = true;
      }
    }

    if (hasCleanedSeed || idOrDateChanged || deduplicated) {
      try {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filteredLogs));
      } catch {
        // ignore
      }
    }

    return filteredLogs;
  } catch {
    return [];
  }
}

export function saveUserLog(log: Omit<UserLog, 'id' | 'timestamp' | 'dateStr'> & { dateStr?: string; timestamp?: number }): UserLog {
  const logs = getUserLogs();
  const now = new Date();
  const dateStr = log.dateStr || getLocalDateStr(now);
  const timestamp = log.timestamp || (log.dateStr ? new Date(`${log.dateStr}T12:00:00`).getTime() : Date.now());
  const newLog: UserLog = {
    ...log,
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    timestamp,
    dateStr
  };

  const updatedLogs = [newLog, ...logs];
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
    notifyLocalDataChanged();
  } catch {
    // ignore
  }

  updateStatsOnNewLog();
  return newLog;
}

export function deleteUserLog(logId: string): UserLog[] {
  const currentLogs = getUserLogs();
  const updatedLogs = currentLogs.filter(l => l.id !== logId);
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
    notifyLocalDataChanged();
  } catch {
    // ignore
  }
  recalculateAndSaveStats(updatedLogs);
  return updatedLogs;
}

export function getUserStats(): UserStats {
  const logs = getUserLogs();
  return recalculateAndSaveStats(logs);
}

function recalculateAndSaveStats(logs: UserLog[]): UserStats {
  const todayStr = getLocalDateStr(new Date());
  const totalSessions = logs.length;
  const totalSeconds = logs.reduce((acc, item) => acc + (item.durationSeconds || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const todayLogs = logs.filter(l => l.dateStr === todayStr);
  const todaySessions = todayLogs.length;
  const todaySeconds = todayLogs.reduce((acc, item) => acc + (item.durationSeconds || 0), 0);
  const todayMinutes = Math.floor(todaySeconds / 60);

  // Consecutive streak calculation based on local dates
  const uniqueDates = Array.from(new Set(logs.map(l => l.dateStr))).sort().reverse();
  
  const yesterdayStr = getLocalDateStr(new Date(Date.now() - 86400000));
  const hasToday = uniqueDates.includes(todayStr);
  const hasYesterday = uniqueDates.includes(yesterdayStr);

  let streak = 0;
  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date() : new Date(Date.now() - 86400000);
    while (true) {
      const curStr = getLocalDateStr(checkDate);
      if (uniqueDates.includes(curStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const statsObj: UserStats = {
    totalSessions,
    totalMinutes,
    totalSeconds,
    todaySessions,
    todayMinutes,
    todaySeconds,
    streakDays: streak,
    lastActiveDate: uniqueDates[0] || ''
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(statsObj));
  } catch {
    // ignore
  }

  return statsObj;
}

function updateStatsOnNewLog() {
  recalculateAndSaveStats(getUserLogs());
}
