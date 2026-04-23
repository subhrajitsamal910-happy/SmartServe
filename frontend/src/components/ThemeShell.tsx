'use client';

import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeShell() {
  const { mode } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return null;
}
