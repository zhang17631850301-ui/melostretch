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
  const lastSyncedUserId = useRef<string | null>(null);

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
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        const currentUser = data.session?.user || null;
        setUser(currentUser);
        if (currentUser && lastSyncedUserId.current !== currentUser.id) {
          lastSyncedUserId.current = currentUser.id;
          void runSync(currentUser);
        }
      })
      .catch((error: any) => setSyncError(error?.message || '登录状态读取失败，请刷新重试'))
      .finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      setLoading(false);
      if (!nextUser) lastSyncedUserId.current = null;
      if (nextUser && lastSyncedUserId.current !== nextUser.id) {
        lastSyncedUserId.current = nextUser.id;
        window.setTimeout(() => void runSync(nextUser), 0);
      }

      const callbackUrl = new URL(window.location.href);
      if (callbackUrl.searchParams.has('code') || callbackUrl.searchParams.has('error')) {
        callbackUrl.searchParams.delete('code');
        callbackUrl.searchParams.delete('error');
        callbackUrl.searchParams.delete('error_code');
        callbackUrl.searchParams.delete('error_description');
        window.history.replaceState({}, document.title, `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setSyncError(error.message || '登录状态读取失败，请刷新重试');
        return;
      }
      const nextUser = data.session?.user || null;
      setUser(nextUser);
      if (nextUser && lastSyncedUserId.current !== nextUser.id) {
        lastSyncedUserId.current = nextUser.id;
        void runSync(nextUser);
      }
    };

    const handleFocus = () => void refreshSession();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refreshSession();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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
