'use client';

import { Plane, Building, Wallet, Star } from 'lucide-react';
import Reveal from './Reveal';
import CountUp from './CountUp';

const STATS = [
  { icon: Plane, value: 12480, suffix: '+', label: 'Trips booked' },
  { icon: Building, value: 480, suffix: '+', label: 'Companies onboarded' },
  { icon: Wallet, value: 128, prefix: '₹', suffix: 'Cr+', label: 'Spend under management' },
  { icon: Star, value: 4.9, decimals: 1, suffix: '/5', label: 'Average satisfaction' },
];

export default function ReviewStats() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-ink py-24 text-paper sm:py-28" style={{ scrollMarginTop: 84 }}>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brass/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-teal/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brass">By the numbers</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Numbers that build confidence
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-paper/55">
            Overall trips, spend and reviews from finance and travel teams running on AKBHAR today.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={i * 0.1} y={20}>
                <div className="rounded-xl border border-paper/10 bg-paper/[0.035] p-6 text-center backdrop-blur-sm transition-colors hover:border-brass/30 hover:bg-paper/[0.06]">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-paper/[0.07]">
                    <Icon className="h-4.5 w-4.5 text-brass" />
                  </div>
                  <div className="mt-4 font-mono text-3xl tracking-tight text-paper sm:text-4xl">
                    <CountUp
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </div>
                  <div className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-paper/40">{stat.label}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
