'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AppHeader } from '../../../components/AppHeader';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('admin@smartserve.ai');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillAdmin = () => {
    setEmail('admin@smartserve.ai');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const fillUser = () => {
    setEmail('user@smartserve.ai');
    setPassword('password123');
    setErrorMessage(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      setLoading(true);
      await login(email.trim(), password);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <AppHeader />
      <section className='mx-auto flex min-h-[calc(100vh-88px)] max-w-md items-center px-4 py-10'>
        <form onSubmit={submit} className='glass card-border w-full rounded-[2rem] p-8 shadow-glow'>
          <h1 className='text-3xl font-black'>Welcome back</h1>
          <p className='mt-2 text-sm text-[var(--muted)]'>Sign in to manage bookings, recommendations, analytics, and realtime alerts.</p>
          
          {errorMessage && (
            <div className='mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'>
              <span className='font-bold'>Login Error: </span>{errorMessage}
            </div>
          )}

          <div className='mt-6 space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1'>Email Address</label>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(null); }}
                type='email'
                required
                placeholder='Email'
                className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700 focus:border-brand-500'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1'>Password</label>
              <input
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(null); }}
                type='password'
                required
                placeholder='Password'
                className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700 focus:border-brand-500'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition disabled:opacity-60 cursor-pointer shadow-md'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className='mt-6 rounded-2xl bg-brand-50/80 p-4 border border-brand-200/60 dark:bg-brand-950/40 dark:border-brand-900/40'>
            <p className='text-xs font-semibold text-brand-900 dark:text-brand-200 mb-2'>
              Quick Demo Accounts (Click to Autofill):
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={fillAdmin}
                className='flex-1 rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-brand-700 border border-brand-200 shadow-sm hover:bg-brand-100/50 transition dark:bg-slate-900 dark:text-brand-300 dark:border-slate-700'
              >
                Admin Demo
              </button>
              <button
                type='button'
                onClick={fillUser}
                className='flex-1 rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-brand-700 border border-brand-200 shadow-sm hover:bg-brand-100/50 transition dark:bg-slate-900 dark:text-brand-300 dark:border-slate-700'
              >
                Customer Demo
              </button>
            </div>
            <p className='mt-2 text-[11px] text-slate-500 dark:text-slate-400'>
              Admin: admin@smartserve.ai / admin123<br />
              Customer: user@smartserve.ai / password123
            </p>
          </div>

          <p className='mt-4 text-sm text-[var(--muted)] text-center'>
            No account yet? <Link href='/signup' className='font-semibold text-brand-700 dark:text-brand-200 hover:underline'>Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
