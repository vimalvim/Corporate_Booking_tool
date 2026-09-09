'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import StatusPill from '@/components/StatusPill';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Booking, Paginated, Approval } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const bookingsRes = await apiGet<Paginated<Booking>>('/bookings/', { page_size: 5 });
      if (bookingsRes.state && bookingsRes.data) setBookings(bookingsRes.data.results);

      if (['MANAGER', 'FINANCE', 'ADMIN'].includes(user.role)) {
        const approvalsRes = await apiGet<Paginated<Approval>>('/approvals/', { status: 'PENDING', page_size: 5 });
        if (approvalsRes.state && approvalsRes.data) setPendingApprovals(approvalsRes.data.results);
      }
      setLoading(false);
    })();
  }, [user]);

  const counts = {
    draft: bookings.filter((b) => b.status === 'DRAFT').length,
    pending: bookings.filter((b) => b.status === 'PENDING_APPROVAL').length,
    approved: bookings.filter((b) => b.status === 'APPROVED' || b.status === 'BOOKED').length,
  };

  return (
    <>
      <Topbar title={`Welcome, ${user?.first_name}`} subtitle="Here's what needs your attention today." />
      <div className="p-6 space-y-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard label="Draft trips" value={counts.draft} accent="border-l-slate-400" />
          <SummaryCard label="Pending approval" value={counts.pending} accent="border-l-brass" />
          <SummaryCard label="Approved / booked" value={counts.approved} accent="border-l-teal" />
        </div>

        {['MANAGER', 'FINANCE', 'ADMIN'].includes(user?.role ?? '') && (
          <section className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base">Awaiting your approval</h2>
              <Link href="/approvals" className="text-sm text-brass hover:underline">View all</Link>
            </div>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-slate">Nothing waiting on you right now.</p>
            ) : (
              <ul className="divide-y divide-line">
                {pendingApprovals.map((a) => (
                  <li key={a.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-mono text-xs text-slate mr-2">{a.booking_reference}</span>
                      {a.employee_name}
                      {a.is_policy_violation && <span className="pill bg-brick-100 text-brick-600 ml-2">Out of policy</span>}
                    </div>
                    <span className="font-medium">{formatCurrency(a.estimated_cost)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base">Recent trips</h2>
            <Link href="/bookings" className="text-sm text-brass hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-slate">No bookings yet. <Link href="/bookings/new" className="text-brass hover:underline">Create one</Link>.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate border-b border-line">
                  <th className="py-2 font-medium">Reference</th>
                  <th className="py-2 font-medium">Destination</th>
                  <th className="py-2 font-medium">Dates</th>
                  <th className="py-2 font-medium">Cost</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2.5">
                      <Link href={`/bookings/${b.id}`} className="font-mono text-xs text-brass hover:underline">{b.reference}</Link>
                    </td>
                    <td className="py-2.5">{b.origin} → {b.destination}</td>
                    <td className="py-2.5 text-slate">{formatDate(b.start_date)}</td>
                    <td className="py-2.5">{formatCurrency(b.estimated_cost)}</td>
                    <td className="py-2.5"><StatusPill status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`panel border-l-4 ${accent} p-5`}>
      <div className="text-3xl font-display">{value}</div>
      <div className="text-sm text-slate mt-1">{label}</div>
    </div>
  );
}
