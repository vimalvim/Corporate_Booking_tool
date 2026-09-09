'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import StatusPill from '@/components/StatusPill';
import { apiGet } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Booking, Paginated, BookingStatus } from '@/types';

const FILTERS: { label: string; value: BookingStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Pending approval', value: 'PENDING_APPROVAL' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Booked', value: 'BOOKED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet<Paginated<Booking>>('/bookings/', { status: filter || undefined, page_size: 50 }).then((res) => {
      if (res.state && res.data) setBookings(res.data.results);
      setLoading(false);
    });
  }, [filter]);

  return (
    <>
      <Topbar title="Travel bookings" subtitle="Every trip you can see, from draft to closed." />
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded text-xs font-medium border ${
                  filter === f.value ? 'bg-ink text-paper border-ink' : 'border-line text-slate hover:bg-black/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Link href="/bookings/new" className="btn-accent">New booking</Link>
        </div>

        <div className="panel overflow-hidden">
          {loading ? (
            <p className="p-5 text-sm text-slate">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="p-5 text-sm text-slate">No bookings match this filter.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate bg-black/[0.02] border-b border-line">
                  <th className="py-2.5 px-4 font-medium">Reference</th>
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Route</th>
                  <th className="py-2.5 px-4 font-medium">Travel dates</th>
                  <th className="py-2.5 px-4 font-medium">Cost</th>
                  <th className="py-2.5 px-4 font-medium">Policy</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.015]">
                    <td className="py-2.5 px-4">
                      <Link href={`/bookings/${b.id}`} className="font-mono text-xs text-brass hover:underline">{b.reference}</Link>
                    </td>
                    <td className="py-2.5 px-4">{b.employee_name}</td>
                    <td className="py-2.5 px-4">{b.origin} → {b.destination}</td>
                    <td className="py-2.5 px-4 text-slate">{formatDate(b.start_date)} – {formatDate(b.end_date)}</td>
                    <td className="py-2.5 px-4">{formatCurrency(b.estimated_cost)}</td>
                    <td className="py-2.5 px-4">
                      {b.is_policy_violation ? (
                        <span className="pill bg-brick-100 text-brick-600">Out of policy</span>
                      ) : (
                        <span className="text-slate text-xs">Within policy</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4"><StatusPill status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
