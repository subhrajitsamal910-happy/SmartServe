'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AppHeader } from '../../../components/AppHeader';
import { StatCard } from '../../../components/StatCard';
import { ServiceCard } from '../../../components/ServiceCard';
import { BookingCard } from '../../../components/BookingCard';
import { BookingModal } from '../../../components/BookingModal';
import { ChatAssistant } from '../../../components/ChatAssistant';
import { AnalyticsCharts } from '../../../components/AnalyticsCharts';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import type { AnalyticsSummary, BookingItem, ChartPoint, CurrentUser, ServiceItem, ServiceProvider } from '../../../lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, isAdmin } = useAuth();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [recommendations, setRecommendations] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [bookingTrend, setBookingTrend] = useState<ChartPoint[]>([]);
  const [categories, setCategories] = useState<ChartPoint[]>([]);
  const [fraud, setFraud] = useState<ChartPoint[]>([]);
  const [assistantReply, setAssistantReply] = useState<string>('Ask the assistant to find the best provider, compare services, or explain booking details.');
  const [query, setQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [category, setCategory] = useState<string>('');

  const currentUser = user as CurrentUser | null;

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [loading, currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;
    void loadInitial();
  }, [currentUser, category]);

  async function loadInitial() {
    try {
      const [serviceList, bookingList, recommendationResult, providerList] = await Promise.all([
        api.listServices(category || undefined),
        api.listBookings(),
        api.recommendations(),
        api.listProviders()
      ]);
      setServices(serviceList);
      setBookings(bookingList);
      setRecommendations(recommendationResult.recommendedServices);
      setProviders(providerList);
      setAssistantReply(recommendationResult.logicSummary);

      if (isAdmin) {
        const [admin, trend, cats, fraudTrend] = await Promise.all([
          api.analytics(),
          api.bookingTrend(10),
          api.topCategories(),
          api.fraudTrends(10)
        ]);
        setAnalytics(admin);
        setBookingTrend(trend);
        setCategories(cats);
        setFraud(fraudTrend);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    }
  }

  const stats = useMemo(() => ({
    confirmed: bookings.filter((booking) => booking.status === 'CONFIRMED').length,
    flagged: bookings.filter((booking) => booking.status === 'FLAGGED').length,
    totalValue: bookings.reduce((sum, booking) => sum + (booking.paymentStatus === 'SUCCESS' ? 1 : 0), 0),
    providerAvailability: providers.filter((provider) => provider.available).length
  }), [bookings, providers]);

  async function handleBook(serviceId: number, scheduledAt: string, durationMinutes: number) {
    try {
      const booking = await api.createBooking(serviceId, scheduledAt, durationMinutes);
      setBookings((prev) => [booking, ...prev]);
      toast.success('Booking created');
      setBookingModalOpen(false);
      setSelectedService(null);
      await loadInitial();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Booking failed');
    }
  }

  async function handleCancel(id: number) {
    try {
      await api.cancelBooking(id);
      toast.success('Booking cancelled');
      setBookings((prev) => prev.map((booking) => booking.bookingId === id ? { ...booking, status: 'CANCELLED' } : booking));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cancel failed');
    }
  }

  async function askAssistant(message: string) {
    try {
      const result = await api.chat(message);
      setAssistantReply(result.response);
      if (result.services.length > 0) {
        setRecommendations(result.services);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Assistant request failed');
    }
  }

  async function toggleProviderAvailability(provider: ServiceProvider) {
    try {
      const updated = await api.updateProviderAvailability(provider.id, !provider.available);
      setProviders((prev) => prev.map((item) => item.id === provider.id ? updated : item));
      toast.success(`${provider.name} availability updated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Provider update failed');
    }
  }

  if (loading || !currentUser) {
    return <main className='grid min-h-screen place-items-center text-[var(--muted)]'>Loading dashboard...</main>;
  }

  return (
    <main>
      <AppHeader userRole={currentUser.role} onLogout={async () => { await logout(); router.push('/'); }} />
      <section className='mx-auto max-w-7xl px-4 py-6 md:px-6'>
        <div className='mb-6 grid gap-4 md:grid-cols-4'>
          <StatCard label='Confirmed bookings' value={stats.confirmed} hint='Live from booking intelligence engine' />
          <StatCard label='Flagged bookings' value={stats.flagged} hint='Fraud or schedule conflict signals' />
          <StatCard label='Available providers' value={stats.providerAvailability} hint='Realtime availability state' />
          <StatCard label='Total success payments' value={stats.totalValue} hint='Stripe test mode or simulated transactions' />
        </div>

        <div className='mb-6 flex flex-wrap items-center gap-3'>
          <button onClick={() => setCategory('')} className={`rounded-full px-4 py-2 text-sm font-semibold ${!category ? 'bg-brand-600 text-white' : 'glass'}`}>All</button>
          {['HOME_CLEANING', 'ELECTRICAL', 'PLUMBING', 'TUTORING', 'PAINTING'].map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? 'bg-brand-600 text-white' : 'glass'}`}>
              {item.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className='grid gap-6 xl:grid-cols-[1.5fr_1fr]'>
          <div className='space-y-6'>
            <div>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Top services</h2>
                <p className='text-sm text-[var(--muted)]'>Semantic + rating-ranked marketplace</p>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBook={(svc) => {
                      setSelectedService(svc);
                      setBookingModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Your bookings</h2>
                <p className='text-sm text-[var(--muted)]'>Scheduling intelligence and payment tracking</p>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                {bookings.map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} onCancel={handleCancel} />
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <ChatAssistant onAsk={askAssistant} />
            <div className='glass card-border rounded-3xl p-5 shadow-glow'>
              <h3 className='text-lg font-bold'>AI insights</h3>
              <div className='mt-2 text-sm text-[var(--muted)] whitespace-pre-line leading-relaxed'>{assistantReply}</div>
            </div>
            <div className='glass card-border rounded-3xl p-5 shadow-glow'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-bold'>Recommendations</h3>
                <button onClick={() => void loadInitial()} className='text-sm font-semibold text-brand-700 dark:text-brand-200'>Refresh</button>
              </div>
              <div className='space-y-3'>
                {recommendations.map((service) => (
                  <div key={service.id} className='rounded-2xl border border-slate-300 p-3 dark:border-slate-700'>
                    <p className='font-semibold'>{service.title}</p>
                    <p className='text-sm text-[var(--muted)]'>{service.providerName} • {service.averageRating.toFixed(1)}★</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='glass card-border rounded-3xl p-5 shadow-glow'>
              <h3 className='text-lg font-bold'>Providers</h3>
              <div className='mt-4 space-y-3'>
                {providers.map((provider) => (
                  <div key={provider.id} className='rounded-2xl border border-slate-300 p-3 dark:border-slate-700'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='font-semibold'>{provider.name}</p>
                        <p className='text-sm text-[var(--muted)]'>{provider.email || 'No email'}</p>
                      </div>
                      <button onClick={() => void toggleProviderAvailability(provider)} className='rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900'>
                        {provider.available ? 'Mark busy' : 'Mark free'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <section className='mt-8 space-y-6'>
            <div className='glass card-border rounded-3xl p-6 shadow-glow'>
              <h2 className='text-2xl font-bold'>Admin analytics</h2>
              {analytics ? (
                <div className='mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
                  <StatCard label='Users' value={analytics.totalUsers} />
                  <StatCard label='Bookings' value={analytics.totalBookings} />
                  <StatCard label='Services' value={analytics.totalServices} />
                  <StatCard label='Flagged' value={analytics.totalFlaggedBookings} />
                  <StatCard label='Top service' value={analytics.mostBookedService} />
                </div>
              ) : null}
            </div>
            <AnalyticsCharts bookings={bookingTrend} categories={categories} fraud={fraud} />
          </section>
        ) : null}
      </section>

      <BookingModal
        service={selectedService}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        onBook={handleBook}
      />
    </main>
  );
}
