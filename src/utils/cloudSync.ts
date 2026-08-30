import { Exercise, UserLog } from '../types';
import { supabase } from './supabase';

const KEYS = {
  favorites: 'melostretch_favorites',
  logs: 'melostretch_logs',
  aiExercises: 'melostretch_ai_exercises',
};
const DEFAULT_FAVORITES = ['ex_neck_side', 'ex_seated_figure_4'];

export interface UserDataSnapshot {
  favorites: string[];
  logs: UserLog[];
  aiExercises: Exercise[];
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeSnapshot(value: Partial<UserDataSnapshot> | null | undefined): UserDataSnapshot {
  const favorites = Array.isArray(value?.favorites)
    ? value.favorites.filter((item): item is string => typeof item === 'string')
    : [];
  const logs = Array.isArray(value?.logs)
    ? value.logs.filter((item): item is UserLog => Boolean(item && typeof item === 'object' && typeof item.id === 'string'))
    : [];
  const aiExercises = Array.isArray(value?.aiExercises)
    ? value.aiExercises.filter((item): item is Exercise => Boolean(item && typeof item === 'object' && typeof item.id === 'string'))
    : [];
  return { favorites, logs, aiExercises };
}

export function getLocalSnapshot(): UserDataSnapshot {
  return normalizeSnapshot({
    favorites: readJson<string[]>(KEYS.favorites, DEFAULT_FAVORITES),
    logs: readJson<UserLog[]>(KEYS.logs, []),
    aiExercises: readJson<Exercise[]>(KEYS.aiExercises, []),
  });
}

function uniqueById<T extends { id: string }>(cloud: T[], local: T[]): T[] {
  const merged = new Map<string, T>();
  [...cloud, ...local].forEach((item) => item?.id && merged.set(item.id, item));
  return Array.from(merged.values());
}

function mergeSnapshots(cloud: UserDataSnapshot, local: UserDataSnapshot): UserDataSnapshot {
  return {
    favorites: Array.from(new Set([...cloud.favorites, ...local.favorites])),
    logs: uniqueById(cloud.logs, local.logs).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),
    aiExercises: uniqueById(cloud.aiExercises, local.aiExercises),
  };
}

function applySnapshot(snapshot: UserDataSnapshot): void {
  localStorage.setItem(KEYS.favorites, JSON.stringify(snapshot.favorites));
  localStorage.setItem(KEYS.logs, JSON.stringify(snapshot.logs));
  localStorage.setItem(KEYS.aiExercises, JSON.stringify(snapshot.aiExercises));
  window.dispatchEvent(new Event('melostretch:data-changed'));
}

async function upsertSnapshot(userId: string, snapshot: UserDataSnapshot): Promise<void> {
  const { error } = await supabase.from('user_data').upsert({
    user_id: userId,
    favorites: snapshot.favorites,
    logs: snapshot.logs,
    ai_exercises: snapshot.aiExercises,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function syncAfterLogin(userId: string): Promise<void> {
  const local = getLocalSnapshot();
  const migrationKey = `melostretch_cloud_migrated_${userId}`;
  const hasMigratedOnThisDevice = localStorage.getItem(migrationKey) === 'true';
  const { data, error } = await supabase
    .from('user_data')
    .select('favorites, logs, ai_exercises')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  const cloud = normalizeSnapshot(data
    ? {
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
        logs: Array.isArray(data.logs) ? data.logs : [],
        aiExercises: Array.isArray(data.ai_exercises) ? data.ai_exercises : [],
      }
    : { favorites: [], logs: [], aiExercises: [] });

  if (data && hasMigratedOnThisDevice) {
    applySnapshot(cloud);
    return;
  }

  const merged = mergeSnapshots(cloud, local);
  await upsertSnapshot(userId, merged);
  localStorage.setItem(migrationKey, 'true');
  applySnapshot(merged);
}

export async function uploadLocalData(userId: string): Promise<void> {
  await upsertSnapshot(userId, getLocalSnapshot());
}

export function clearSyncedLocalData(): void {
  localStorage.removeItem(KEYS.favorites);
  localStorage.removeItem(KEYS.logs);
  localStorage.removeItem(KEYS.aiExercises);
  window.dispatchEvent(new Event('melostretch:data-changed'));
}
