import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { clearSyncedLocalData, syncAfterLogin, uploadLocalData } from '../utils/cloudSync';
import { supabase } from '../utils/supabase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  syncing: boolean;
  syncError: string;
  sendLoginLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  retrySync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const uploadTimer = useRef<number | null>(null);

  const runSync = async (targetUser: User) => {
    setSyncing(true);
    setSyncError('');
    try {
      await syncAfterLogin(targetUser.id);
    } catch (error: any) {
      setSyncError(error?.message || '云端同步失败，请稍后重试');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) void runSync(currentUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      setLoading(false);
      if (nextUser) window.setTimeout(() => void runSync(nextUser), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleLocalChange = () => {
      if (!user) return;
      if (uploadTimer.current) window.clearTimeout(uploadTimer.current);
      uploadTimer.current = window.setTimeout(async () => {
        try {
          await uploadLocalData(user.id);
          setSyncError('');
        } catch (error: any) {
          setSyncError(error?.message || '数据暂未同步，联网后请重试');
        }
      }, 500);
    };

    window.addEventListener('melostretch:local-data-changed', handleLocalChange);
    return () => {
      window.removeEventListener('melostretch:local-data-changed', handleLocalChange);
      if (uploadTimer.current) window.clearTimeout(uploadTimer.current);
    };
  }, [user]);

  const sendLoginLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearSyncedLocalData();
  };

  const retrySync = async () => {
    if (user) await runSync(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, syncing, syncError, sendLoginLink, signOut, retrySync }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
