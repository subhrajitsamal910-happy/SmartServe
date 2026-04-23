'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function ChatAssistant({ onAsk }: { onAsk: (message: string) => Promise<void> }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    await onAsk(message);
    setMessage('');
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='glass card-border rounded-3xl p-5 shadow-glow'>
      <div className='mb-4 flex items-center gap-2 font-semibold'><MessageCircle size={18} /> Smart Assistant</div>
      <form onSubmit={submit} className='flex gap-2'>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Ask for provider suggestions, pricing, or service help...' className='flex-1 rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
        <button disabled={loading} className='rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60'>
          {loading ? '...' : 'Ask'}
        </button>
      </form>
    </motion.div>
  );
}
