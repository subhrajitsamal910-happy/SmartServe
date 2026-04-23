'use client';

import { BookingItem } from '../lib/types';
import { CalendarClock, CreditCard, AlertTriangle } from 'lucide-react';

export function BookingCard({
  booking,
  onCancel
}: {
  booking: BookingItem;
  onCancel?: (id: number) => Promise<void>;
}) {
  const suggested = booking.suggestedRescheduleAt ? new Date(booking.suggestedRescheduleAt).toLocaleString() : null;

  return (
    <div className='glass card-border rounded-3xl p-4 shadow-glow'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h4 className='font-bold'>{booking.serviceTitle}</h4>
          <p className='text-sm text-[var(--muted)]'>Scheduled for {new Date(booking.scheduledAt).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200' : booking.status === 'FLAGGED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
          {booking.status}
        </span>
      </div>
      <div className='mt-4 grid gap-2 text-sm'>
        <div className='flex items-center gap-2 text-[var(--muted)]'><CalendarClock size={16} /> Duration {booking.durationMinutes} min</div>
        <div className='flex items-center gap-2 text-[var(--muted)]'><CreditCard size={16} /> Payment {booking.paymentStatus}{booking.paymentTransactionId ? ` • ${booking.paymentTransactionId}` : ''}</div>
        {booking.status === 'FLAGGED' ? (
          <div className='flex items-center gap-2 text-amber-600 dark:text-amber-300'><AlertTriangle size={16} /> {booking.fraudMessage}</div>
        ) : null}
        {suggested ? <p className='text-xs text-[var(--muted)]'>Suggested reschedule: {suggested}</p> : null}
      </div>
      {onCancel && booking.status === 'CONFIRMED' ? (
        <button onClick={() => void onCancel(booking.bookingId)} className='mt-4 w-full rounded-2xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40'>
          Cancel booking
        </button>
      ) : null}
    </div>
  );
}
