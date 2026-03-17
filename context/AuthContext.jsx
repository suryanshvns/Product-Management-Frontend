'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { get, getAuthToken } from '@/lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const res = await get('/auth/me');
      const u = res?.data?.user ?? res?.user ?? null;
      setUserState(u);
    } catch {
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const setUser = useCallback((u) => {
    setUserState(u);
  }, []);

  const hasRole = useCallback(
    (role) => {
      if (!user?.roles || !Array.isArray(user.roles)) return false;
      const allowed = Array.isArray(role) ? role : [role];
      return allowed.some((r) => user.roles.includes(r));
    },
    [user]
  );

  const isAuthenticated = !!getAuthToken();

  const value = {
    user,
    setUser,
    loading,
    loadUser,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
