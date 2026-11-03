'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Send } from 'lucide-react';

const POPULAR_QUESTIONS = [
  '💡 What is SmartServe?',
  '⭐ Top services',
  '📅 How do I book?',
  '🛡️ Fraud scoring',
  '🔑 Demo logins'
];

export function ChatAssistant({ onAsk }: { onAsk: (message: string) => Promise<void> }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event?: FormEvent, customText?: string) => {
    if (event) event.preventDefault();
    const query = (customText || message).trim();
    if (!query || loading) return;

    setLoading(true);
    await onAsk(query);
    if (!customText) setMessage('');
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='glass card-border rounded-3xl p-5 shadow-glow'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2 font-bold'>
          <Sparkles className='h-4 w-4 text-brand-600 dark:text-brand-400' />
          <span>Smart AI Assistant</span>
        </div>
        <span className='rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
          Online
        </span>
      </div>

      <p className='mb-3 text-xs text-[var(--muted)]'>
        Ask any question about our services, booking process, fraud detection, or pricing.
      </p>

      <form onSubmit={(e) => void submit(e)} className='flex gap-2'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Ask anything about SmartServe...'
          disabled={loading}
          className='flex-1 rounded-2xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 dark:border-slate-700'
        />
        <button
          type='submit'
          disabled={loading || !message.trim()}
          className='flex items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50'
        >
          {loading ? '...' : <Send size={15} />}
        </button>
      </form>

      {/* Quick clickable chips */}
      <div className='mt-3 flex flex-wrap gap-1.5'>
        {POPULAR_QUESTIONS.map((q) => (
          <button
            key={q}
            type='button'
            disabled={loading}
            onClick={() => void submit(undefined, q)}
            className='rounded-full border border-slate-200 bg-white/50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-brand-950/40 dark:hover:text-brand-300'
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
