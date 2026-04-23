'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ServiceItem } from '../lib/types';
import { useState } from 'react';

export function BookingModal({
  service,
  onBook,
  open,
  onOpenChange
}: {
  service: ServiceItem | null;
  onBook: (serviceId: number, scheduledAt: string, durationMinutes: number) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
        <Dialog.Content className='fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-[var(--bg-elev)] p-6 shadow-glow'>
          <div className='mb-4 flex items-center justify-between'>
            <Dialog.Title className='text-xl font-bold'>Schedule booking</Dialog.Title>
            <Dialog.Close className='rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10'><X size={18} /></Dialog.Close>
          </div>
          <p className='mb-4 text-sm text-[var(--muted)]'>Choose a time and duration for {service?.title}.</p>
          <div className='space-y-3'>
            <input type='datetime-local' value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <input type='number' min={30} max={240} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700' />
            <button
              onClick={async () => {
                if (!service || !scheduledAt) return;
                await onBook(service.id, new Date(scheduledAt).toISOString(), durationMinutes);
                onOpenChange(false);
              }}
              className='w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white'
            >
              Confirm booking
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
