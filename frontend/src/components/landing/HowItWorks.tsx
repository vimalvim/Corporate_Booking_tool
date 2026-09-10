'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, ShieldCheck, UserCheck, Plane, FileBarChart } from 'lucide-react';
import Reveal from './Reveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  { icon: FileText, title: 'Submit Request', desc: 'Employee raises a trip request with dates, route and purpose.' },
  { icon: ShieldCheck, title: 'Policy Check', desc: 'The engine validates the itinerary against travel policy instantly.' },
  { icon: UserCheck, title: 'Approval', desc: 'Routed automatically to the right approver based on amount and grade.' },
  { icon: Plane, title: 'Book & Confirm', desc: 'Ticket, hotel and cab are booked and confirmed in one flow.' },
  { icon: FileBarChart, title: 'Reconcile', desc: 'Spend is tracked against budget through to final reconciliation.' },
];

export default function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative bg-brass-100/25 py-24 sm:py-28"
      style={{ scrollMarginTop: 84 }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brass">Workflow</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From request to reconciliation, in five steps
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate">
            No spreadsheets, no email chains — every trip moves through the same auditable path.
          </p>
        </Reveal>

        {/* Desktop timeline */}
        <div className="relative mt-20 hidden lg:block">
          <div className="absolute left-0 right-0 top-6 h-px bg-line" />
          <div
            ref={lineRef}
            className="absolute left-0 top-6 h-px w-full origin-left bg-gradient-to-r from-brass via-brass to-teal"
          />
          <div className="grid grid-cols-5 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={i * 0.12} y={16}>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel shadow-panel">
                      <Icon className="h-5 w-5 text-brass-600" />
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-slate-400/70">0{i + 1}</span>
                    <h3 className="mt-3 font-display text-sm font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-[12.5px] leading-5 text-slate">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="relative mt-14 space-y-8 lg:hidden">
          <div className="absolute bottom-2 left-[23px] top-2 w-px bg-line" />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 0.08} y={14}>
                <div className="relative flex gap-4 pl-0">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-panel shadow-panel">
                    <Icon className="h-5 w-5 text-brass-600" />
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-semibold text-ink">{step.title}</h3>
                      <span className="font-mono text-[10px] text-slate-400/70">0{i + 1}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
