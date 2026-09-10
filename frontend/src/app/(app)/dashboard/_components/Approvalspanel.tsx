'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ShieldAlert,
} from 'lucide-react';

import { formatCurrency } from '@/lib/format';
import type { Approval } from '@/types';

interface ApprovalsPanelProps {
  approvals: Approval[];
}

export default function ApprovalsPanel({
  approvals,
}: ApprovalsPanelProps) {
  return (
    <section className="panel rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brick-100 text-brick-600">
              <ShieldAlert size={17} />
            </div>

            <h2 className="font-display text-base font-medium">
              Approval centre
            </h2>
          </div>

          <p className="mt-2 text-xs text-slate">
            Requests waiting for your decision
          </p>
        </div>

        <Link
          href="/approvals"
          className="flex items-center gap-1 text-sm text-brass hover:underline"
        >
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Empty */}
      {approvals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
            <CheckCircle2 size={21} />
          </div>

          <h3 className="mt-3 text-sm font-medium">
            You're all caught up
          </h3>

          <p className="mt-1 text-xs text-slate">
            No travel requests are waiting for approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => {
            const initials = a.employee_name
              .split(' ')
              .map((name) => name[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={a.id}
                className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Accent */}
                <div className="absolute left-0 top-0 h-full w-1 bg-brass" />

                {/* Top */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate">
                      {initials}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {a.employee_name}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-slate">
                        {a.booking_reference}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate">
                      Trip value
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(a.estimated_cost)}
                    </p>
                  </div>
                </div>

                {/* Status / warning */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-brass/10 px-3 py-1 text-[11px] font-medium text-brass">
                    <Clock3 size={12} />
                    Awaiting approval
                  </span>

                  {a.is_policy_violation && (
                    <span className="flex items-center gap-1.5 rounded-full bg-brick-100 px-3 py-1 text-[11px] font-medium text-brick-600">
                      <CircleAlert size={12} />
                      Out of policy
                    </span>
                  )}
                </div>

                {/* Bottom action */}
                <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
                  <div>
                    <p className="text-xs font-medium">
                      Travel request
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate">
                      Review the trip before approving
                    </p>
                  </div>

                  <Link
                    href={`/approvals/${a.id}`}
                    className="group flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-white transition-all hover:opacity-90"
                  >
                    Review request
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}