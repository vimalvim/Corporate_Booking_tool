'use client';

import { Plane, ShieldCheck, Users, BarChart3 } from 'lucide-react';
import Reveal from './Reveal';

const FEATURES = [
  {
    number: '01',
    icon: Plane,
    title: 'Smart Booking',
    desc: 'Search and book flights, hotels and cabs from live inventory — with every option already filtered against your travel policy.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Policy Engine',
    desc: 'Every itinerary is validated in real time against company travel policy before it can ever be confirmed.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Dynamic Approvals',
    desc: 'Approval chains adapt automatically based on trip amount, employee grade and policy exceptions — no manual routing.',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Budget & Spend',
    desc: 'Track department budgets, corporate cards and reimbursements from the moment a trip is requested to reconciliation.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-paper py-24 sm:py-28" style={{ scrollMarginTop: 84 }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brass">Platform</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything you need to run corporate travel
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate">
            A single system that connects booking, policy, approvals and spend — so nothing
            falls through the cracks between request and reconciliation.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.number} delay={i * 0.1} y={22}>
                <div className="group relative h-full rounded-lg border border-line bg-panel p-6 shadow-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brass-100 transition-colors group-hover:bg-brass group-hover:text-white">
                      <Icon className="h-5 w-5 text-brass-600 transition-colors group-hover:text-white" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400/60">{feature.number}</span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-slate">{feature.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
