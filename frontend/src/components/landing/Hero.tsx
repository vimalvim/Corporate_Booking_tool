'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Plane, ShieldCheck, Wallet, ChevronDown, Sparkles } from 'lucide-react';

const COMPANIES = ['NORTHWIND FREIGHT', 'SOLACE RETAIL', 'VAULTBRIDGE CAPITAL', 'ORBITAL LABS', 'HARBORLINE'];

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const policyChipRef = useRef<HTMLDivElement>(null);
  const spendChipRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          eyebrowRef.current,
          headlineRef.current,
          subRef.current,
          ctaRef.current,
          logosRef.current,
          cardRef.current,
          policyChipRef.current,
          spendChipRef.current,
        ],
        { opacity: 0 }
      );

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(eyebrowRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.15')
        .fromTo(subRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .fromTo(ctaRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo(logosRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 26, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          '-=0.25'
        )
        .fromTo(policyChipRef.current, { opacity: 0, y: 14, x: 10 }, { opacity: 1, y: 0, x: 0, duration: 0.5 }, '-=0.3')
        .fromTo(spendChipRef.current, { opacity: 0, y: 14, x: -10 }, { opacity: 1, y: 0, x: 0, duration: 0.5 }, '-=0.35');

    
      if (policyChipRef.current) {
        gsap.to(policyChipRef.current, { y: -8, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      }
      if (spendChipRef.current) {
        gsap.to(spendChipRef.current, { y: 8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
      }

      // Flight route loop
      const runFlight = () => {
        const plane = planeRef.current;
        const line = lineRef.current;
        if (!plane || !line) return;
        gsap.killTweensOf(plane);
        gsap.set(plane, { x: 0, rotation: 0, opacity: 1 });

        const distance = () => line.offsetWidth;
        const flight = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });

        flight
          .to(plane, {
            x: () => distance(),
            duration: 3.4,
            ease: 'power1.inOut',
            onStart: () => {
              gsap.to(originRef.current, { scale: 0.85, opacity: 0.5, duration: 0.2 });
              gsap.to(destRef.current, { scale: 1.25, duration: 0.25, ease: 'back.out(2)' });
            },
            onComplete: () => gsap.to(destRef.current, { scale: 1, duration: 0.2 }),
          })
          .to({}, { duration: 0.8 })
          .to(plane, { rotation: 180, duration: 0.4, ease: 'power2.inOut' })
          .to(plane, {
            x: 0,
            duration: 3.4,
            ease: 'power1.inOut',
            onStart: () => {
              gsap.to(destRef.current, { scale: 0.85, opacity: 0.5, duration: 0.2 });
              gsap.to(originRef.current, { scale: 1.25, opacity: 1, duration: 0.25, ease: 'back.out(2)' });
            },
            onComplete: () => gsap.to(originRef.current, { scale: 1, duration: 0.2 }),
          })
          .to({}, { duration: 0.8 })
          .to(plane, { rotation: 0, duration: 0.4, ease: 'power2.inOut' });
      };

      gsap.delayedCall(1.6, runFlight);

      // Ambient status dot pulse
      const dots = rootRef.current?.querySelectorAll('.hero-status-dot');
      if (dots) {
        gsap.to(dots, { opacity: 0.35, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative overflow-hidden bg-ink pb-28 pt-36 text-paper sm:pt-40"
      style={{ scrollMarginTop: 84 }}
    >
   
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <div className="absolute -left-48 -top-56 h-[560px] w-[560px] rounded-full bg-brass/10 blur-[130px]" />
        <div className="absolute -bottom-56 -right-40 h-[520px] w-[520px] rounded-full bg-teal/10 blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div ref={eyebrowRef} className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brass" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-brass">
            Enterprise travel infrastructure
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[56px]"
        >
          Corporate travel,
          <br />
          <span className="text-paper/40">orchestrated end to end.</span>
        </h1>

        <p ref={subRef} className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-paper/55 sm:text-base">
          One operating layer for requests, policy validation, approvals, budgets and
          spend — so every trip stays compliant and every rupee stays visible.
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="btn-accent group px-6 py-3 text-sm">
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('how-it-works');
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
            }}
            className="btn border border-paper/20 px-6 py-3 text-sm text-paper hover:bg-paper/10"
          >
            See how it works
          </a>
        </div>

        {/* Trust logos */}
        <div ref={logosRef} className="mx-auto mt-14 max-w-2xl">
          <p className="text-[9px] uppercase tracking-[0.28em] text-paper/25">
            Trusted by finance &amp; travel teams at
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {COMPANIES.map((name) => (
              <span key={name} className="font-mono text-[11px] tracking-[0.14em] text-paper/30">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live itinerary visual */}
      <div className="relative mx-auto mt-16 max-w-3xl px-5 sm:px-8">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl border border-paper/10 bg-white/[0.035] shadow-[0_25px_80px_rgba(0,0,0,.28)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-paper/[0.07] px-6 py-3.5">
            <div className="flex items-center gap-2">
              <span className="hero-status-dot h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />
              <span className="text-[9px] uppercase tracking-[0.22em] text-paper/40">Live itinerary</span>
            </div>
            <span className="font-mono text-[10px] text-paper/25">AK-2048</span>
          </div>

          <div className="p-6 sm:p-7">
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-[32px] tracking-tight sm:text-[36px]">MAA</div>
                <div className="mt-1 text-[10px] text-paper/35">Chennai</div>
              </div>

              <div className="relative mx-6 mb-4 flex-1">
                <div ref={lineRef} className="h-px bg-gradient-to-r from-paper/10 via-brass/70 to-paper/10" />
                <div ref={originRef} className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-paper/80" />
                    <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
                  </div>
                </div>
                <div ref={destRef} className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-paper/80" />
                    <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
                  </div>
                </div>
                <div
                  ref={planeRef}
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="relative">
                    <div className="absolute inset-[-8px] rounded-full bg-brass/20 blur-md" />
                    <Plane className="relative h-4 w-4 text-brass" style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-[32px] tracking-tight sm:text-[36px]">SFO</div>
                <div className="mt-1 text-[10px] text-paper/35">San Francisco</div>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-2.5">
              <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                <div className="text-[8px] uppercase tracking-[0.18em] text-paper/25">Duration</div>
                <div className="mt-1 font-mono text-xs text-paper/80">17h 45m</div>
              </div>
              <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                <div className="text-[8px] uppercase tracking-[0.18em] text-paper/25">Policy</div>
                <div className="mt-1 font-mono text-xs text-emerald-400">Compliant</div>
              </div>
              <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                <div className="text-[8px] uppercase tracking-[0.18em] text-paper/25">Approval</div>
                <div className="mt-1 font-mono text-xs text-brass">Auto-cleared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating chips */}
        <div
          ref={policyChipRef}
          className="absolute -right-3 -top-6 hidden w-[150px] rounded-xl border border-paper/10 bg-[#171717]/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)] backdrop-blur-xl sm:block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[7px] uppercase tracking-[0.18em] text-paper/30">Policy score</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-xl text-paper">98.7%</div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper/10">
            <div className="h-full w-[98.7%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
          </div>
        </div>

        <div
          ref={spendChipRef}
          className="absolute -left-3 -bottom-7 hidden w-[168px] rounded-xl border border-paper/10 bg-[#171717]/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)] backdrop-blur-xl sm:block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[7px] uppercase tracking-[0.18em] text-paper/30">Controlled spend</span>
            <Wallet className="h-3.5 w-3.5 text-brass" />
          </div>
          <div className="mt-2 font-mono text-xl text-paper">₹24.8M</div>
          <div className="mt-1.5 text-[7px] text-emerald-400">↓ 12.4% vs previous period</div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => {
          const el = document.getElementById('features');
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
        }}
        aria-label="Scroll to features"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-paper/30 hover:text-paper/60 sm:block"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </section>
  );
}
