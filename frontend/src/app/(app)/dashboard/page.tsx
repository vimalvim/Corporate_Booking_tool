'use client';

import { useEffect, useState } from 'react';
import { FileEdit, Clock3, CheckCircle2 } from 'lucide-react';
import Topbar from '@/components/Topbar';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { buildMonthlyTrend } from '@/lib/dashboard-trend';
import type { Booking, Paginated, Approval } from '@/types';
import SummaryCard from './_components/SummaryCard';
import StatusDonut from './_components/Statusdonut';
import ApprovalsPanel from './_components/Approvalspanel';
import RecentTripsTable from './_components/Recenttripstable';
import TrendChart from '@/components/Trendchart';


export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [trend, setTrend] = useState<
    Record<string, string | number>[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Larger window used for the trend chart and status donut only.
      // Swap for a dedicated /bookings/stats endpoint once one exists server-side.
      const res = await apiGet<Paginated<Booking>>('/bookings/', { page_size: 200 });
      if (res.state && res.data) {
        setAllBookings(res.data.results);
        setTrend(buildMonthlyTrend(res.data.results));
      }
      setStatsLoading(false);
    })();
  }, [user]);

  const counts = {
    draft: bookings.filter((b) => b.status === 'DRAFT').length,
    pending: bookings.filter((b) => b.status === 'PENDING_APPROVAL').length,
    approved: bookings.filter((b) => b.status === 'APPROVED' || b.status === 'BOOKED').length,
  };

  const canApprove = ['MANAGER', 'FINANCE', 'ADMIN'].includes(user?.role ?? '');

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FBF9F4] via-[#F6F2E8] to-[#F1ECDF]">
      <span className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brass opacity-[0.08] blur-[100px]" aria-hidden />
      <span className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-teal opacity-[0.06] blur-[100px]" aria-hidden />

      <div className="relative">
        <Topbar title={`Welcome, ${user?.first_name}`} subtitle="Here's what needs your attention today." />

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard label="Draft trips" value={counts.draft} icon={FileEdit} accent="slate" />
            <SummaryCard label="Pending approval" value={counts.pending} icon={Clock3} accent="brass" />
            <SummaryCard label="Approved / booked" value={counts.approved} icon={CheckCircle2} accent="teal" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendChart
  data={trend}
  xAxisKey="month"
  title="Trips overview"
  description="Booked vs cancelled trips, last 12 months"
  totalLabel="total booked trips this period"
  totalSeriesKey="booked"
  loading={statsLoading}
  series={[
    {
      key: 'booked',
      label: 'Booked',
      gradient: {
        from: '#f59e0b',
        middle: '#d97706',
        to: '#0f766e',
      },
      fill: true,
      strokeWidth: 2.5,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      color: '#94a3b8',
      dashed: true,
      strokeWidth: 1.5,
    },
  ]}
/>
            </div>
            <StatusDonut bookings={allBookings} loading={statsLoading} />
          </div>

          {canApprove && <ApprovalsPanel approvals={pendingApprovals} />}

          <RecentTripsTable bookings={bookings} loading={loading} />
        </div>
      </div>
    </div>
  );
}