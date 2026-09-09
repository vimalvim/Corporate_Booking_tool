'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import StatusPill from '@/components/StatusPill';
import { apiGet, apiPost } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import type { Booking, Approval } from '@/types';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [justification, setJustification] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [violationPreview, setViolationPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await apiGet<Booking>(`/bookings/${id}/`);
    if (res.state && res.data) setBooking(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-6 text-sm text-slate">Loading…</div>;
  if (!booking) return <div className="p-6 text-sm text-slate">Booking not found.</div>;

  const isOwner = user?.id === booking.employee;
  const canEdit = isOwner && booking.status === 'DRAFT';
  const canCancel = isOwner && !['CANCELLED', 'REJECTED'].includes(booking.status);

  const handleSubmit = async () => {
    setActionError(null);
    setSubmitting(true);
    const res = await apiPost(`/bookings/${id}/submit/`, { deviation_justification: justification });
    setSubmitting(false);
    if (res.state) {
      setViolationPreview(null);
      load();
    } else {
      // The API returns policy_violation_details when justification is required.
      const err = res.errors as { policy_violation_details?: string } | undefined;
      if (err?.policy_violation_details) setViolationPreview(err.policy_violation_details);
      setActionError(res.message || 'Could not submit this booking.');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    const res = await apiPost(`/bookings/${id}/cancel/`);
    if (res.state) load();
    else setActionError(res.message || 'Could not cancel this booking.');
  };

  return (
    <>
      <Topbar title={booking.reference} subtitle={`${booking.origin} → ${booking.destination} · ${booking.employee_name}`} />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <StatusPill status={booking.status} />
          {booking.is_policy_violation && <span className="pill bg-brick-100 text-brick-600">Out of policy</span>}
          <span className="text-sm text-slate ml-auto">{formatCurrency(booking.estimated_cost)}</span>
        </div>

        <section className="panel p-5">
          <h2 className="font-display text-base mb-3">Trip summary</h2>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate">Purpose</dt><dd>{booking.purpose}</dd>
            <dt className="text-slate">Trip type</dt><dd>{booking.trip_type}</dd>
            <dt className="text-slate">Travel dates</dt><dd>{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</dd>
            <dt className="text-slate">Department</dt><dd>{booking.department}</dd>
            <dt className="text-slate">Submitted</dt><dd>{formatDateTime(booking.submitted_at)}</dd>
          </dl>
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-base mb-3">Travel items</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate border-b border-line">
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 font-medium">Provider</th>
                <th className="py-2 font-medium">Class / category</th>
                <th className="py-2 font-medium">Details</th>
                <th className="py-2 font-medium">Cost</th>
                <th className="py-2 font-medium">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {booking.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2">{item.item_type}</td>
                  <td className="py-2">{item.provider}</td>
                  <td className="py-2">{item.class_or_category}</td>
                  <td className="py-2 text-slate">{item.details || '—'}</td>
                  <td className="py-2">{formatCurrency(item.cost)}</td>
                  <td className="py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {(booking.is_policy_violation || violationPreview) && (
          <section className="panel p-5 border-l-4 border-l-brick">
            <h2 className="font-display text-base mb-2">Rule deviation / out-of-policy</h2>
            <p className="text-sm text-slate mb-2">{booking.policy_violation_details || violationPreview}</p>
            {booking.deviation_justification && (
              <p className="text-sm"><span className="text-slate">Employee justification: </span>{booking.deviation_justification}</p>
            )}
          </section>
        )}

        {booking.approvals?.length > 0 && (
          <section className="panel p-5">
            <h2 className="font-display text-base mb-3">Approval matrix status</h2>
            <ol className="space-y-2">
              {booking.approvals.map((a: Approval) => (
                <li key={a.id} className="flex items-center justify-between text-sm border border-line rounded px-3 py-2">
                  <span>Level {a.level} · {a.approver_role}{a.approver_name ? ` (${a.approver_name})` : ''}</span>
                  <span className="flex items-center gap-2">
                    {a.comments && <span className="text-slate text-xs italic">&ldquo;{a.comments}&rdquo;</span>}
                    <span className={`pill ${
                      a.status === 'APPROVED' ? 'bg-teal-100 text-teal-600' :
                      a.status === 'REJECTED' ? 'bg-brick-100 text-brick-600' :
                      a.status === 'SKIPPED' ? 'bg-black/5 text-slate' : 'bg-brass-100 text-brass-600'
                    }`}>{a.status}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {actionError && (
          <div className="rounded border border-brick-100 bg-brick-100 px-4 py-3 text-sm text-brick-600">{actionError}</div>
        )}

        {canEdit && (
          <section className="panel p-5 space-y-3">
            <h2 className="font-display text-base">Submit for approval</h2>
            <p className="text-sm text-slate">
              Submitting runs a policy check automatically. If any item is out of policy, add a justification
              below before submitting — Finance will see it as part of the approval.
            </p>
            <div>
              <label className="field-label">Deviation justification (only needed if out of policy)</label>
              <textarea
                className="field-input"
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="e.g. No policy-compliant hotel inventory available for these dates."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={submitting} className="btn-accent">
                {submitting ? 'Submitting…' : 'Submit for approval'}
              </button>
              <button onClick={handleCancel} className="btn-outline">Discard draft</button>
            </div>
          </section>
        )}

        {canCancel && !canEdit && (
          <button onClick={handleCancel} className="btn-danger">Cancel booking</button>
        )}
      </div>
    </>
  );
}
