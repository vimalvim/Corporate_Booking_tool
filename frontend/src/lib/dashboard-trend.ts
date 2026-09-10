import { TrendPoint } from '@/app/(app)/dashboard/_components/Trendchart';
import type { Booking } from '@/types';

const CANCELLED_STATUSES = new Set(['CANCELLED']);
const BOOKED_STATUSES = new Set(['APPROVED', 'BOOKED']);

/**
 * Groups bookings by month (based on start_date) over the last `months` months
 * into counts the TrendChart can plot. Replace this with a dedicated
 * `/bookings/stats/monthly` endpoint once one exists server-side — this
 * client-side aggregation only reflects whatever page of bookings was fetched.
 */
export function buildMonthlyTrend(bookings: Booking[], months = 12): TrendPoint[] {
  const now = new Date();
  const buckets = new Map<string, TrendPoint>();

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(key, { month: d.toLocaleDateString('en-US', { month: 'short' }), booked: 0, cancelled: 0 });
  }

  for (const b of bookings) {
    if (!b.start_date) continue;
    const d = new Date(b.start_date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (BOOKED_STATUSES.has(b.status)) bucket.booked += 1;
    else if (CANCELLED_STATUSES.has(b.status)) bucket.cancelled += 1;
  }

  return Array.from(buckets.values());
}