'use client';

import type { LucideIcon } from 'lucide-react';

type Accent = 'slate' | 'brass' | 'teal';

const ACCENT_STYLES: Record<
  Accent,
  { cardBg: string; badge: string; glow: string; trend: string }
> = {
  slate: {
    cardBg: 'from-white to-slate-50',
    badge: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-300/50',
    glow: 'bg-slate-400',
    trend: 'text-slate-500',
  },
  brass: {
    cardBg: 'from-white to-brass/10',
    badge: 'bg-gradient-to-br from-amber-400 to-brass text-white shadow-brass/40',
    glow: 'bg-brass',
    trend: 'text-brass',
  },
  teal: {
    cardBg: 'from-white to-teal/10',
    badge: 'bg-gradient-to-br from-teal-400 to-teal text-white shadow-teal/40',
    glow: 'bg-teal',
    trend: 'text-teal',
  },
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: Accent;
  trend?: { value: number; period: string };
}

export default function SummaryCard({ label, value, icon: Icon, accent, trend }: SummaryCardProps) {
  const styles = ACCENT_STYLES[accent];
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-line/60 bg-gradient-to-br ${styles.cardBg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <span
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${styles.glow} opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]`}
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-3xl font-display tracking-tight text-ink">{value}</div>
          <div className="mt-1 text-sm text-slate">{label}</div>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${styles.badge}`}>
          <Icon size={18} strokeWidth={2.25} />
        </span>
      </div>

      {trend && (
        <div className="relative mt-4 flex items-center gap-1 text-xs">
          <span className={isPositive ? styles.trend : 'text-slate-400'}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-slate/70">{trend.period}</span>
        </div>
      )}
    </div>
  );
}