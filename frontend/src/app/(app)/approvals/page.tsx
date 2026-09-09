'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { Approval, Paginated } from '@/types';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | ''>('PENDING');
  const [comments, setComments] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await apiGet<Paginated<Approval>>('/approvals/', { status: statusFilter || undefined, page_size: 50 });
    if (res.state && res.data) setApprovals(res.data.results);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const decide = async (approval: Approval, decision: 'APPROVED' | 'REJECTED') => {
    setError(null);
    setBusyId(approval.id);
    const res = await apiPost(`/approvals/${approval.id}/decide/`, {
      decision,
      comments: comments[approval.id] || '',
    });
    setBusyId(null);
    if (res.state) load();
    else setError(res.message || 'Could not record your decision.');
  };

  return (
    <>
      <Topbar title="Approvals" subtitle="Review and action travel requests routed to you by the approval matrix." />
      <div className="p-6 max-w-4xl">
        <div className="flex gap-1.5 mb-4">
          {(['PENDING', ''] as const).map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-medium border ${
                statusFilter === s ? 'bg-ink text-paper border-ink' : 'border-line text-slate hover:bg-black/5'
              }`}
            >
              {s === 'PENDING' ? 'Pending' : 'All history'}
            </button>
          ))}
        </div>

        {error && <div className="rounded border border-brick-100 bg-brick-100 px-4 py-3 text-sm text-brick-600 mb-4">{error}</div>}

        {loading ? (
          <p className="text-sm text-slate">Loading…</p>
        ) : approvals.length === 0 ? (
          <p className="text-sm text-slate">Nothing here right now.</p>
        ) : (
          <div className="space-y-3">
            {approvals.map((a) => (
              <div key={a.id} className="panel p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/bookings/${a.booking}`} className="font-mono text-xs text-brass hover:underline">
                        {a.booking_reference}
                      </Link>
                      <span className="text-sm font-medium">{a.employee_name}</span>
                      {a.is_policy_violation && <span className="pill bg-brick-100 text-brick-600">Out of policy</span>}
                    </div>
                    <p className="text-xs text-slate">Level {a.level} · {a.approver_role} approval</p>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{formatCurrency(a.estimated_cost)}</span>
                </div>

                {a.status === 'PENDING' ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="field-input"
                      rows={2}
                      placeholder="Optional comment for your decision"
                      value={comments[a.id] || ''}
                      onChange={(e) => setComments((c) => ({ ...c, [a.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => decide(a, 'APPROVED')}
                        disabled={busyId === a.id}
                        className="btn-accent text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => decide(a, 'REJECTED')}
                        disabled={busyId === a.id}
                        className="btn-danger text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate mt-2">
                    Already <span className="font-medium">{a.status.toLowerCase()}</span>
                    {a.approver_name ? ` by ${a.approver_name}` : ''}.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
