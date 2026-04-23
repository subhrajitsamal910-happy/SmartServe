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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      toast.success('Account created');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
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
          <div className='mt-6 space-y-4'>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Full name' className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' minLength={8} placeholder='Password (min 8 characters)' className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <button disabled={loading} className='w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white disabled:opacity-60'>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
          <p className='mt-4 text-sm text-[var(--muted)]'>Already have an account? <Link href='/login' className='font-semibold text-brand-700 dark:text-brand-200'>Sign in</Link></p>
        </form>
      </section>
    </main>
  );
}
