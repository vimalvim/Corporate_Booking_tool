"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  Check,
} from "lucide-react";
import Reveal from "./Reveal";

const PRODUCT_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it Works" },
  { id: "testimonials", label: "Testimonials" },
  { id: "reviews", label: "Reviews" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 84,
    behavior: "smooth",
  });
}

export default function LandingFooter() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <footer className="relative overflow-hidden bg-ink-800 text-paper">
      {/* CTA banner */}
      <div className="border-b border-paper/10">
        <Reveal className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to take control of corporate travel?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-paper/50">
            Set up your workspace in minutes — no credit card required.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-accent group px-6 py-3 text-sm">
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/signin"
              className="btn border border-paper/20 px-6 py-3 text-sm text-paper hover:bg-paper/10"
            >
              Sign In
            </Link>
          </div>
        </Reveal>
      </div>

      <div
        id="contact"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8"
        style={{ scrollMarginTop: 84 }}
      >
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr]">
          <Reveal>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-paper/15 bg-paper/[0.07]">
                <Plane className="h-4 w-4 text-paper" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-[15px] font-semibold tracking-tight">
                  AKBHAR
                </span>
                <span className="mt-0.5 block text-[9px] tracking-[0.22em] text-paper/40">
                  CORPORATE TRAVELS
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-paper/45">
              One operating layer for corporate travel, approvals, budgets and
              spend — from request to reconciliation.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {["X", "in", "ig"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/15 text-[10px] font-medium text-paper/60 transition-colors hover:border-brass/50 hover:text-brass"
                >
                  {label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/40">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-[13.5px] text-paper/60 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Company links */}
          <Reveal delay={0.1}>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/40">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {["About", "Careers", "Privacy Policy", "Terms of Service"].map(
                (label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-[13.5px] text-paper/60 transition-colors hover:text-paper"
                    >
                      {label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/40">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2.5 text-[13.5px] text-paper/60">
                <Mail className="h-3.5 w-3.5 text-brass" />
                <a
                  href="mailto:hello@akbhar.travel"
                  className="transition-colors hover:text-paper"
                >
                  hello@akbhar.travel
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[13.5px] text-paper/60">
                <Phone className="h-3.5 w-3.5 text-brass" />
                <a
                  href="tel:+914412345678"
                  className="transition-colors hover:text-paper"
                >
                  +91 44 1234 5678
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[13.5px] text-paper/60">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
                <span>
                  Guindy Industrial Estate, Chennai, Tamil Nadu 600032
                </span>
              </li>
            </ul>

            {submitted ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-3 text-[13px] text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                Thanks — we&apos;ll get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-2.5">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your name"
                  className="w-full rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-2 text-[13px] text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="Work email"
                  className="w-full rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-2 text-[13px] text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none"
                />
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="How can we help?"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-paper/15 bg-paper/[0.04] px-3 py-2 text-[13px] text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none"
                />
                <button type="submit" className="btn-accent w-full text-[13px]">
                  Send message
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-paper/35 sm:flex-row sm:px-8">
          <span>
            © {new Date().getFullYear()} AKBHAR Corporate Travels. All rights
            reserved.
          </span>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-paper/70">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-paper/70">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-paper/70">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
