import type { BookingStatus } from '@/types';

export const formatCurrency = (value: string | number) => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};

export const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const STATUS_STYLES: Record<BookingStatus, { label: string; pill: string }> = {
  DRAFT: { label: 'Draft', pill: 'bg-black/5 text-slate' },
  PENDING_APPROVAL: { label: 'Pending approval', pill: 'bg-brass-100 text-brass-600' },
  APPROVED: { label: 'Approved', pill: 'bg-teal-100 text-teal-600' },
  REJECTED: { label: 'Rejected', pill: 'bg-brick-100 text-brick-600' },
  BOOKED: { label: 'Booked', pill: 'bg-ink text-paper' },
  CANCELLED: { label: 'Cancelled', pill: 'bg-black/5 text-slate' },
};

export const ROLE_LABELS: Record<string, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager / Approver',
  FINANCE: 'Finance',
  ADMIN: 'Admin',
};
