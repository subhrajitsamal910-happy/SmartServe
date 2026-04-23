'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { ChartPoint } from '../lib/types';

export function AnalyticsCharts({
  bookings,
  categories,
  fraud
}: {
  bookings: ChartPoint[];
  categories: ChartPoint[];
  fraud: ChartPoint[];
}) {
  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      <div className='glass card-border rounded-3xl p-4 shadow-glow'>
        <p className='mb-3 font-semibold'>Bookings trend</p>
        <ResponsiveContainer width='100%' height={240}>
          <LineChart data={bookings}>
            <XAxis dataKey='label' hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#256dd0' strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='glass card-border rounded-3xl p-4 shadow-glow'>
        <p className='mb-3 font-semibold'>Top categories</p>
        <ResponsiveContainer width='100%' height={240}>
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray='3 3' opacity={0.2} />
            <XAxis dataKey='label' hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey='value' fill='#22c55e' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='glass card-border rounded-3xl p-4 shadow-glow'>
        <p className='mb-3 font-semibold'>Fraud trends</p>
        <ResponsiveContainer width='100%' height={240}>
          <LineChart data={fraud}>
            <XAxis dataKey='label' hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#f59e0b' strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
