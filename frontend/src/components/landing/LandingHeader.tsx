"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Menu, X, ArrowRight } from "lucide-react";

const NAV_ITEMS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it Works" },
  { id: "testimonials", label: "Testimonials" },
  { id: "reviews", label: "Reviews" },
];

const HEADER_OFFSET = 84;

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const dark = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-line shadow-panel"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setMenuOpen(false);
          }}
          className="flex items-center gap-2.5"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              dark ? "border-paper/15 bg-paper/[0.07]" : "border-line bg-ink"
            }`}
          >
            <Plane
              className={`h-4 w-4 ${dark ? "text-paper" : "text-paper"}`}
            />
          </span>
          <span className="leading-none">
            <span
              className={`block font-display text-[15px] font-semibold tracking-tight transition-colors ${
                dark ? "text-paper" : "text-ink"
              }`}
            >
              AKBHAR
            </span>
            <span
              className={`mt-0.5 block text-[9px] tracking-[0.22em] transition-colors ${
                dark ? "text-paper/40" : "text-slate-400"
              }`}
            >
              CORPORATE TRAVELS
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                activeId === item.id
                  ? dark
                    ? "text-paper"
                    : "text-ink"
                  : dark
                    ? "text-paper/55 hover:text-paper"
                    : "text-slate hover:text-ink"
              }`}
            >
              {item.label}
              {activeId === item.id && (
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full ${
                    dark ? "bg-brass" : "bg-brass"
                  }`}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/signin"
            className={`btn ${
              dark
                ? "border border-paper/20 text-paper hover:bg-paper/10"
                : "border border-line text-ink hover:bg-black/5"
            }`}
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn-accent group">
            Get Started
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`flex h-9 w-9 items-center justify-center rounded-lg lg:hidden ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-96 border-t border-line" : "max-h-0"
        } bg-paper/98 backdrop-blur-md`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-black/5"
            >
              {item.label}
            </button>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
            <Link
              href="/signin"
              className="btn-outline w-full"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-accent w-full"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
