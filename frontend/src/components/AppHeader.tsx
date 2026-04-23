'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import type { UserRole } from '../lib/types';

export function AppHeader({
  userRole,
  onLogout
}: {
  userRole?: UserRole | null;
  onLogout?: () => Promise<void>;
}) {
  return (
    <header className='sticky top-0 z-40 border-b border-white/10 bg-[color:var(--bg)]/80 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6'>
        <Link href='/' className='flex items-center gap-3 font-semibold tracking-tight'>
          <span className='grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white shadow-glow'>S</span>
          <span>SmartServe AI</span>
        </Link>
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          {userRole ? <span className='rounded-full border border-slate-300 px-3 py-2 text-sm font-medium dark:border-slate-700'>{userRole}</span> : null}
          {onLogout ? (
            <button onClick={onLogout} className='rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900'>
              Logout
            </button>
          ) : (
            <div className='flex gap-2'>
              <Link href='/login' className='rounded-full px-4 py-2 text-sm font-semibold'>Login</Link>
              <Link href='/signup' className='rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white'>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
