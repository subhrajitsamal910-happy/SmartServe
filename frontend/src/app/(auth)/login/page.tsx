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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
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
          <div className='mt-6 space-y-4'>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <button disabled={loading} className='w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white disabled:opacity-60'>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <p className='mt-4 text-sm text-[var(--muted)]'>No account yet? <Link href='/signup' className='font-semibold text-brand-700 dark:text-brand-200'>Create one</Link></p>
          <p className='mt-4 rounded-2xl bg-brand-50 p-3 text-xs text-brand-900 dark:bg-brand-950/50 dark:text-brand-100'>Demo credentials: admin@smartserve.ai / admin123 or user@smartserve.ai / password123</p>
        </form>
      </section>
    </main>
  );
}
