'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../lib/types';
import { useState, useEffect } from 'react';

interface BookingModalProps {
  service: ServiceItem | null;
  onBook: (serviceId: number, scheduledAt: string, durationMinutes: number) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getDefaultScheduledAt(): string {
  // Default: tomorrow at 10:00 AM (local time)
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  // datetime-local input needs YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const DURATION_OPTIONS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
];

export function BookingModal({ service, onBook, open, onOpenChange }: BookingModalProps) {
  const [scheduledAt, setScheduledAt] = useState(getDefaultScheduledAt());
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state whenever the modal opens with a new service
  useEffect(() => {
    if (open) {
      setScheduledAt(getDefaultScheduledAt());
      setDurationMinutes(60);
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [open]);

  function validate(): string | null {
    if (!scheduledAt) return 'Please pick a date and time.';
    const chosen = new Date(scheduledAt);
    if (isNaN(chosen.getTime())) return 'Invalid date/time selected.';
    if (chosen <= new Date()) return 'Scheduled time must be in the future.';
    if (durationMinutes < 30) return 'Duration must be at least 30 minutes.';
    if (durationMinutes > 240) return 'Duration cannot exceed 4 hours (240 min).';
    return null;
  }

  async function handleConfirm() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!service) return;

    setError(null);
    setLoading(true);
    try {
      // Convert local datetime-local string to full ISO 8601 with milliseconds
      const iso = new Date(scheduledAt).toISOString();
      await onBook(service.id, iso, durationMinutes);
      setSuccess(true);
      // Close after brief success flash
      setTimeout(() => onOpenChange(false), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Minimum value for datetime-local input: now + 1 minute
  const minDateTime = (() => {
    const d = new Date(Date.now() + 60_000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!loading) onOpenChange(o); }}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' />
        <Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-[var(--bg-elev)] p-6 shadow-2xl'>

          {/* Header */}
          <div className='mb-5 flex items-start justify-between gap-3'>
            <div>
              <Dialog.Title className='text-xl font-bold'>Schedule Booking</Dialog.Title>
              {service && (
                <p className='mt-1 text-sm font-medium text-brand-600 dark:text-brand-300'>
                  {service.title} — ₹{service.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <Dialog.Close
              disabled={loading}
              className='rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40'
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Success state */}
          {success && (
            <div className='flex flex-col items-center gap-3 py-8 text-center'>
              <CheckCircle2 size={48} className='text-green-500' />
              <p className='text-lg font-bold text-green-600 dark:text-green-400'>Booking Confirmed!</p>
              <p className='text-sm text-[var(--muted)]'>Your booking has been placed successfully.</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <div className='space-y-5'>

              {/* Date & Time */}
              <div className='space-y-1'>
                <label className='flex items-center gap-2 text-sm font-semibold text-[var(--muted)]'>
                  <Calendar size={14} />
                  Date &amp; Time
                </label>
                <input
                  type='datetime-local'
                  value={scheduledAt}
                  min={minDateTime}
                  onChange={(e) => { setScheduledAt(e.target.value); setError(null); }}
                  className='w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600'
                />
              </div>

              {/* Duration */}
              <div className='space-y-1'>
                <label className='flex items-center gap-2 text-sm font-semibold text-[var(--muted)]'>
                  <Clock size={14} />
                  Duration
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type='button'
                      onClick={() => { setDurationMinutes(opt.value); setError(null); }}
                      className={`rounded-2xl border py-2.5 text-sm font-semibold transition-all ${
                        durationMinutes === opt.value
                          ? 'border-brand-500 bg-brand-600 text-white shadow-md'
                          : 'border-slate-300 bg-transparent hover:border-brand-400 dark:border-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider & Price summary */}
              {service && (
                <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[var(--muted)]'>Provider</span>
                    <span className='font-medium'>{service.providerName}</span>
                  </div>
                  <div className='mt-1 flex items-center justify-between'>
                    <span className='text-[var(--muted)]'>Estimated cost</span>
                    <span className='font-semibold text-brand-600 dark:text-brand-300'>
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className='mt-1 flex items-center justify-between'>
                    <span className='text-[var(--muted)]'>Availability</span>
                    <span className={service.providerAvailable ? 'font-medium text-green-600' : 'font-medium text-red-500'}>
                      {service.providerAvailable ? '✓ Available' : '✗ Busy'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className='flex items-start gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300'>
                  <AlertCircle size={16} className='mt-0.5 shrink-0' />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className='flex gap-3 pt-1'>
                <button
                  type='button'
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className='flex-1 rounded-2xl border border-slate-300 py-3 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleConfirm}
                  disabled={loading || !service?.providerAvailable}
                  className='flex-1 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {loading ? 'Booking…' : !service?.providerAvailable ? 'Provider Busy' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
