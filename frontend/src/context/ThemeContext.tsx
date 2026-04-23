'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Mode = 'light' | 'dark';
type Accent = 'ocean' | 'emerald' | 'sunset';

type ThemeContextValue = {
  mode: Mode;
  accent: Accent;
  toggleMode: () => void;
  setAccent: (accent: Accent) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(mode: Mode, accent: Accent) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.dataset.accent = accent;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');
  const [accent, setAccentState] = useState<Accent>('ocean');

  useEffect(() => {
    const storedMode = (localStorage.getItem('smartbooking_theme') as Mode | null) || 'light';
    const storedAccent = (localStorage.getItem('smartbooking_accent') as Accent | null) || 'ocean';
    setMode(storedMode);
    setAccentState(storedAccent);
    applyTheme(storedMode, storedAccent);
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('smartbooking_theme', next);
      applyTheme(next, accent);
      return next;
    });
  };

  const setAccent = (next: Accent) => {
    setAccentState(next);
    localStorage.setItem('smartbooking_accent', next);
    applyTheme(mode, next);
  };

  const value = useMemo(() => ({ mode, accent, toggleMode, setAccent }), [mode, accent]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
