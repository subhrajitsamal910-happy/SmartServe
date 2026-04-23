'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ServiceItem } from '../lib/types';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

export function ServiceCard({
  service,
  onBook,
  onViewProvider
}: {
  service: ServiceItem;
  onBook: (service: ServiceItem) => void;
  onViewProvider?: (providerName: string) => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className='glass card-border overflow-hidden rounded-3xl shadow-glow'
    >
      <div className='relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800'>
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={service.title} fill className='object-cover' />
        ) : (
          <div className='flex h-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white'>
            <Sparkles size={40} />
          </div>
        )}
        <div className='absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
          {service.category}
        </div>
      </div>
      <div className='space-y-3 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className='text-lg font-bold'>{service.title}</h3>
            <p className='text-sm text-[var(--muted)]'>{service.providerName}</p>
          </div>
          <div className='text-right'>
            <p className='text-lg font-bold'>₹{service.price.toFixed(0)}</p>
            <p className='text-xs text-[var(--muted)]'>{service.bookingCount} bookings</p>
          </div>
        </div>
        <p className='line-clamp-3 text-sm text-[var(--muted)]'>{service.description}</p>
        <div className='flex flex-wrap gap-2 text-xs font-medium'>
          <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300'>
            <Star size={12} /> {service.averageRating.toFixed(1)} ({service.ratingCount})
          </span>
          <span className='inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-1 text-brand-700 dark:border-brand-900/60 dark:bg-brand-950/50 dark:text-brand-200'>
            <ShieldCheck size={12} /> {service.providerAvailable ? 'Provider available' : 'Busy right now'}
          </span>
        </div>
        <div className='flex gap-2 pt-2'>
          <button onClick={() => onBook(service)} className='flex-1 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700'>
            Book now
          </button>
          {onViewProvider ? (
            <button onClick={() => onViewProvider(service.providerName)} className='rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700'>
              Provider
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
