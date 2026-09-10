"use client";

import { Star } from "lucide-react";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    quote:
      "We went from three-day approval cycles to same-hour clearances. Finance finally has real-time visibility into every trip before it happens.",
    name: "Ananya Rao",
    role: "Head of Travel",
    company: "Solace Retail",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80",
    quote:
      "Policy violations used to slip through constantly. Now the system catches them before booking, not after the invoice lands on my desk.",
    name: "Karthik Iyer",
    role: "VP Finance",
    company: "Northwind Freight",
  },
  {
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
    quote:
      "Our employees book their own trips in minutes and never have to think about policy — it is enforced automatically, quietly, every time.",
    name: "Priya Menon",
    role: "Travel Ops Lead",
    company: "Vaultbridge Capital",
  },
];

const LOGO_STRIP = [
  "NORTHWIND FREIGHT",
  "SOLACE RETAIL",
  "VAULTBRIDGE CAPITAL",
  "ORBITAL LABS",
  "HARBORLINE",
  "MERIDIAN WORKS",
  "CASTLEGATE",
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-paper py-24 sm:py-28"
      style={{ scrollMarginTop: 84 }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brass">
            Loved by travel teams
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Finance and travel teams trust AKBHAR
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate">
            Hear from the people who run corporate travel and expense on our
            platform every day.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12} y={22}>
              <div className="relative flex h-full flex-col rounded-lg border border-line bg-panel p-6 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-line object-cover"
                  />
                  <div>
                    <div className="text-[14px] font-semibold text-ink">
                      {t.name}
                    </div>
                    <div className="text-[12px] text-slate">
                      {t.role} · {t.company}
                    </div>

                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5 fill-brass text-brass"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-[13.5px] leading-6 text-ink/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.2}
          className="mt-16 overflow-hidden border-y border-line py-6"
        >
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-14">
            {[...LOGO_STRIP, ...LOGO_STRIP].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className=" text-[12px] font-semibold tracking-[0.2em] text-black transition-colors hover:text-black"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
