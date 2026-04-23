export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className='glass card-border rounded-2xl p-4 shadow-glow'>
      <p className='text-sm text-[var(--muted)]'>{label}</p>
      <p className='mt-2 text-3xl font-bold tracking-tight'>{value}</p>
      {hint ? <p className='mt-1 text-xs text-[var(--muted)]'>{hint}</p> : null}
    </div>
  );
}
