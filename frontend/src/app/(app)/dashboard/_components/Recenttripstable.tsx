'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  MapPin,
  Plane,
  WalletCards,
} from 'lucide-react';

import StatusPill from '@/components/StatusPill';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Booking } from '@/types';

interface RecentTripsTableProps {
  bookings: Booking[];
  loading: boolean;
}

export default function RecentTripsTable({
  bookings,
  loading,
}: RecentTripsTableProps) {
  return (
    <section className="panel overflow-hidden rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <Plane size={17} />
          </span>

          <div>
            <h2 className="font-display text-base font-medium">
              Recent trips
            </h2>

            <p className="mt-0.5 text-xs text-slate">
              Your latest travel activity
            </p>
          </div>
        </div>

        <Link
          href="/bookings"
          className="group flex items-center gap-1 text-sm font-medium text-brass"
        >
          View all
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border border-line p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-4 w-48 rounded bg-slate-200" />
                </div>

                <div className="h-5 w-20 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        /* Empty */
        <div className="flex items-center justify-center rounded-xl border border-dashed border-line bg-cream/30 py-9">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
              <Plane size={18} />
            </div>

            <p className="text-sm font-medium">
              No bookings yet
            </p>

            <p className="mt-1 text-xs text-slate">
              Start planning your next business trip.
            </p>

            <Link
              href="/bookings/new"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brass hover:underline"
            >
              Create a trip
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        /* Trips */
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className="group block rounded-xl border border-line bg-white/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/20 hover:bg-cream/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* Route Icon */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Plane size={18} />

                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal" />
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-slate">
                      {b.reference}
                    </span>

                    <StatusPill status={b.status} />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="truncate">
                      {b.origin}
                    </span>

                    <span className="text-slate transition-transform group-hover:translate-x-1">
                      →
                    </span>

                    <span className="truncate">
                      {b.destination}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {formatDate(b.start_date)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      Business trip
                    </span>
                  </div>
                </div>

                {/* Cost */}
                <div className="hidden shrink-0 items-center gap-3 sm:flex">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-slate">
                      Estimated
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(b.estimated_cost)}
                    </p>
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-slate transition-colors group-hover:border-teal/20 group-hover:text-teal">
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>

              {/* Mobile cost */}
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 sm:hidden">
                <span className="flex items-center gap-1.5 text-[11px] text-slate">
                  <WalletCards size={13} />
                  Estimated cost
                </span>

                <span className="text-sm font-semibold">
                  {formatCurrency(b.estimated_cost)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}