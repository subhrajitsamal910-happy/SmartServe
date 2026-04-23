import Link from 'next/link';
import { Sparkles, Shield, Clock3, Bot, ChartColumn, BellRing } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

const features = [
  { icon: Sparkles, title: 'AI service discovery', text: 'Natural-language assistant helps users find the right service instantly.' },
  { icon: Shield, title: 'Secure sessions', text: 'JWT + refresh tokens, role-based access, and rate limiting.' },
  { icon: Clock3, title: 'Smart scheduling', text: 'Conflict detection and rescheduling suggestions before bookings are confirmed.' },
  { icon: Bot, title: 'Contextual chatbot', text: 'The assistant understands service context and booking history.' },
  { icon: ChartColumn, title: 'Deep analytics', text: 'User, provider, and admin dashboards with trend charts.' },
  { icon: BellRing, title: 'Realtime notifications', text: 'Live updates powered by WebSocket + async events.' }
];

export default function HomePage() {
  return (
    <main>
      <AppHeader />
      <section className='mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6'>
        <div className='space-y-6'>
          <span className='inline-flex rounded-full border border-brand-200 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-brand-200'>
            Smart Service Marketplace
          </span>
          <h1 className='max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl'>AI-powered marketplace operations, not just CRUD.</h1>
          <p className='max-w-xl text-lg text-[var(--muted)]'>
            SmartServe AI blends booking intelligence, semantic search, contextual AI chat, realtime booking updates, and clean UX into one deployable platform.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link href='/signup' className='rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-700'>Get started</Link>
            <Link href='/login' className='rounded-full border border-slate-300 px-6 py-3 font-semibold dark:border-slate-700'>Sign in</Link>
          </div>
        </div>
        <div className='glass card-border animate-float rounded-[2rem] p-6 shadow-glow'>
          <div className='rounded-[1.5rem] bg-slate-950 p-6 text-white dark:bg-slate-100 dark:text-slate-950'>
            <p className='text-sm uppercase tracking-[0.35em] text-white/60 dark:text-slate-600'>Live assistant</p>
            <p className='mt-4 text-2xl font-bold'>"Find a trusted electrician available tomorrow evening"</p>
            <div className='mt-6 space-y-3 text-sm'>
              <div className='rounded-2xl bg-white/10 p-3 dark:bg-slate-200'>Search results ranked by ratings, proximity, and availability.</div>
              <div className='rounded-2xl bg-white/10 p-3 dark:bg-slate-200'>Booking conflicts are detected and reschedule options suggested.</div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-20 md:px-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className='glass card-border rounded-3xl p-5 shadow-glow'>
                <Icon className='text-brand-600' />
                <h3 className='mt-4 text-lg font-bold'>{feature.title}</h3>
                <p className='mt-2 text-sm text-[var(--muted)]'>{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
