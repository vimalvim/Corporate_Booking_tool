import { STATUS_STYLES } from '@/lib/format';
import type { BookingStatus } from '@/types';

export default function StatusPill({ status }: { status: BookingStatus }) {
  const style = STATUS_STYLES[status] ?? { label: status, pill: 'bg-black/5 text-slate' };
  return <span className={`pill ${style.pill}`}>{style.label}</span>;
}
