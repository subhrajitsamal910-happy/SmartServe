'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AppHeader } from '../../../components/AppHeader';
import { useAuth } from '../../../context/AuthContext';

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Signup failed';
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
          <h1 className='text-3xl font-black'>Create account</h1>
          <p className='mt-2 text-sm text-[var(--muted)]'>Start using the AI marketplace and booking intelligence dashboard.</p>
          
          {errorMessage && (
            <div className='mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'>
              <span className='font-bold'>Registration Error: </span>{errorMessage}
            </div>
          )}

          <div className='mt-6 space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1'>Full Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMessage(null); }}
                required
                placeholder='Full name'
                className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700 focus:border-brand-500'
              />
            </div>
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
              <label className='block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1'>Password (min 6 characters)</label>
              <input
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(null); }}
                type='password'
                required
                minLength={6}
                placeholder='Password'
                className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700 focus:border-brand-500'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition disabled:opacity-60 cursor-pointer shadow-md'
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
          <p className='mt-4 text-sm text-[var(--muted)] text-center'>
            Already have an account? <Link href='/login' className='font-semibold text-brand-700 dark:text-brand-200 hover:underline'>Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
