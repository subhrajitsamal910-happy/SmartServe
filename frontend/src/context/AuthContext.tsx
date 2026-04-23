'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { CurrentUser, UserRole } from '../lib/types';

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const sessionUser = api.getSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
        return;
      }
      const me = await api.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    await api.login(email, password);
    await refreshUser();
  };

  const register = async (name: string, email: string, password: string) => {
    await api.register(name, email, password);
    await login(email, password);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    register,
    logout,
    refreshUser
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
