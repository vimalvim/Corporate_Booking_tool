'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { apiGet } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/format';

interface SpendRow { department: string; total_spend: string; trip_count: number; allocated_amount: string | null; remaining_amount: string | null; }
interface FunnelRow { status: string; count: number; }
interface ViolationRow { reference: string; employee: string; department: string; status: string; estimated_cost: string; policy_violation_details: string; deviation_justification: string; created_at: string; }
interface TurnaroundData { overall_avg_hours: number | null; by_policy_violation: { is_policy_violation: boolean; avg_hours: number | null; count: number }[]; }

export default function ReportsPage() {
  const [spend, setSpend] = useState<SpendRow[]>([]);
  const [funnel, setFunnel] = useState<FunnelRow[]>([]);
  const [violations, setViolations] = useState<ViolationRow[]>([]);
  const [turnaround, setTurnaround] = useState<TurnaroundData | null>(null);

  useEffect(() => {
    apiGet<SpendRow[]>('/reports/spend-by-department/').then((r) => r.state && r.data && setSpend(r.data));
    apiGet<FunnelRow[]>('/reports/booking-funnel/').then((r) => r.state && r.data && setFunnel(r.data));
    apiGet<ViolationRow[]>('/reports/policy-violations/').then((r) => r.state && r.data && setViolations(r.data));
    apiGet<TurnaroundData>('/reports/approval-turnaround/').then((r) => r.state && r.data && setTurnaround(r.data));
  }, []);

  const maxSpend = Math.max(1, ...spend.map((s) => parseFloat(s.total_spend)));
  const maxFunnel = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <>
      <Topbar title="Reports & MIS" subtitle="Spend, pipeline health, policy compliance and approval turnaround." />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="panel p-5">
            <h2 className="font-display text-base mb-4">Spend by department</h2>
            <div className="space-y-3">
              {spend.map((s) => (
                <div key={s.department}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.department}</span>
                    <span className="text-slate">{formatCurrency(s.total_spend)} · {s.trip_count} trips</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full bg-brass" style={{ width: `${(parseFloat(s.total_spend) / maxSpend) * 100}%` }} />
                  </div>
                </div>
              ))}
              {spend.length === 0 && <p className="text-sm text-slate">No approved spend yet.</p>}
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="font-display text-base mb-4">Booking funnel</h2>
            <div className="space-y-3">
              {funnel.map((f) => (
                <div key={f.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{f.status.replace('_', ' ')}</span>
                    <span className="text-slate">{f.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full bg-teal" style={{ width: `${(f.count / maxFunnel) * 100}%` }} />
                  </div>
                </div>
              ))}
              {funnel.length === 0 && <p className="text-sm text-slate">No bookings yet.</p>}
            </div>
          </section>
        </div>

        {turnaround && (
          <section className="panel p-5">
            <h2 className="font-display text-base mb-3">Approval turnaround</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="border border-line rounded p-4">
                <div className="text-2xl font-display">{turnaround.overall_avg_hours ?? '—'}h</div>
                <div className="text-xs text-slate mt-1">Overall average</div>
              </div>
              {turnaround.by_policy_violation.map((row) => (
                <div key={String(row.is_policy_violation)} className="border border-line rounded p-4">
                  <div className="text-2xl font-display">{row.avg_hours ?? '—'}h</div>
                  <div className="text-xs text-slate mt-1">
                    {row.is_policy_violation ? 'Out-of-policy bookings' : 'In-policy bookings'} ({row.count})
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="panel p-5">
          <h2 className="font-display text-base mb-3">Policy violations (Rule Deviation register)</h2>
          {violations.length === 0 ? (
            <p className="text-sm text-slate">No out-of-policy bookings recorded.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate border-b border-line">
                  <th className="py-2 font-medium">Reference</th>
                  <th className="py-2 font-medium">Employee</th>
                  <th className="py-2 font-medium">Department</th>
                  <th className="py-2 font-medium">Cost</th>
                  <th className="py-2 font-medium">Reason</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {violations.map((v) => (
                  <tr key={v.reference}>
                    <td className="py-2">
                      <Link href={`/bookings/${v.reference.split('-')[1] ? parseInt(v.reference.split('-')[1], 10) : ''}`} className="font-mono text-xs text-brass hover:underline">
                        {v.reference}
                      </Link>
                    </td>
                    <td className="py-2">{v.employee}</td>
                    <td className="py-2">{v.department}</td>
                    <td className="py-2">{formatCurrency(v.estimated_cost)}</td>
                    <td className="py-2 text-slate text-xs max-w-xs">{v.policy_violation_details}</td>
                    <td className="py-2">{v.status}</td>
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
