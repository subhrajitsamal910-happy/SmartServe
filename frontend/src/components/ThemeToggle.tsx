'use client';

import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { mode, accent, toggleMode, setAccent } = useTheme();

  return (
    <div className='flex items-center gap-2'>
      <select
        value={accent}
        onChange={(event) => setAccent(event.target.value as 'ocean' | 'emerald' | 'sunset')}
        className='rounded-full border border-slate-300 bg-transparent px-3 py-2 text-sm font-medium outline-none dark:border-slate-700'
      >
        <option value='ocean'>Ocean</option>
        <option value='emerald'>Emerald</option>
        <option value='sunset'>Sunset</option>
      </select>
      <button
        onClick={toggleMode}
        className='rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-brand-700'
      >
        {mode === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
    </div>
  );
}
