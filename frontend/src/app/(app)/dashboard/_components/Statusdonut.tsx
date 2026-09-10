import DonutChart, {
  type DonutSegment,
} from '@/components/DonutChart';

import type { Booking } from '@/types';

const STATUS_SEGMENTS: DonutSegment[] = [
  {
    key: 'approved',
    label: 'Approved / booked',
    values: ['APPROVED', 'BOOKED'],
    from: '#2dd4bf',
    to: '#0f766e',
    dotClassName: 'bg-teal',
  },
  {
    key: 'pending',
    label: 'Pending approval',
    values: ['PENDING_APPROVAL'],
    from: '#fbbf24',
    to: '#b45309',
    dotClassName: 'bg-brass',
  },
  {
    key: 'draft',
    label: 'Draft',
    values: ['DRAFT'],
    from: '#cbd5e1',
    to: '#64748b',
    dotClassName: 'bg-slate-400',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    values: ['CANCELLED'],
    from: '#fca5a5',
    to: '#b91c1c',
    dotClassName: 'bg-brick-600',
  },
];

interface StatusDonutProps {
  bookings: Booking[];
  loading?: boolean;
}

export default function StatusDonut({
  bookings,
  loading,
}: StatusDonutProps) {
  return (
    <DonutChart
      data={bookings}
      segments={STATUS_SEGMENTS}
      getValue={(booking) => booking.status}
      loading={loading}
      title="Trip status mix"
      description="Current portfolio by status"
      totalLabel="total trips"
      emptyMessage="No trips yet."
      valueLabel="trips"
    />
  );
}
