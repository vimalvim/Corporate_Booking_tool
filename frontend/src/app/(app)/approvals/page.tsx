"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { apiGet, apiPost } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Approval, Paginated } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  History,
  Layers3,
  MessageSquare,
  Ticket,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<"PENDING" | "">("");

  const [comments, setComments] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    const res = await apiGet<Paginated<Approval>>("/approvals/", {
      status: statusFilter || undefined,
      page_size: 50,
    });

    if (res.state && res.data) {
      setApprovals(res.data.results);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const decide = async (
    approval: Approval,
    decision: "APPROVED" | "REJECTED",
  ) => {
    setError(null);
    setBusyId(approval.id);

    const res = await apiPost(`/approvals/${approval.id}/decide/`, {
      decision,
      comments: comments[approval.id] || "",
    });

    setBusyId(null);

    if (res.state) {
      load();
    } else {
      setError(res.message || "Could not record your decision.");
    }
  };

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;

  return (
    <>
      <Topbar />

      <main className="min-h-[calc(100vh-76px)] bg-[#f7f7f5]">
        <div className="w-full px-6 py-7 lg:px-8">
          <div className="mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4d8c0] bg-[#f5ecdc] text-[#a87820]">
                <CheckCircle2 size={18} strokeWidth={1.8} />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-ink">
                Approvals
              </h1>
            </div>

            <p className="mt-1.5 pl-[47px] text-sm text-slate">
              Review and action travel requests routed to you.
            </p>
          </div>
          <section className="w-full overflow-hidden rounded-xl border border-[#ded8cc] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e4dfd5] bg-[#fcfbf8] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5ddce] bg-white text-[#a87820]">
                  <ClipboardCheck size={17} strokeWidth={1.7} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-ink">
                    Approval queue
                  </h2>

                  <p className="mt-0.5 text-xs text-slate">
                    Review travel requests and take action.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#e8ddc7] bg-[#f8f0e2] px-3 py-1.5">
                <Clock3
                  size={14}
                  strokeWidth={1.8}
                  className="text-[#a87820]"
                />

                <span className="text-xs font-medium text-ink">
                  {pendingCount} pending
                </span>
              </div>
            </div>
            <div className="border-b border-[#e1dcd2] bg-[#faf9f6] px-5 py-3">
              <div className="inline-flex rounded-lg border border-[#d9d3c8] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-all ${
                    statusFilter === ""
                      ? "border-[#d6bf91] bg-[#f4ead7] text-ink shadow-sm"
                      : "border-transparent bg-transparent text-slate hover:bg-[#f6f4ef] hover:text-ink"
                  }`}
                >
                  <History size={14} strokeWidth={1.8} />

                  <span>All history</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("PENDING")}
                  className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-all ${
                    statusFilter === "PENDING"
                      ? "border-[#d6bf91] bg-[#f4ead7] text-ink shadow-sm"
                      : "border-transparent bg-transparent text-slate hover:bg-[#f6f4ef] hover:text-ink"
                  }`}
                >
                  <Clock3 size={14} strokeWidth={1.8} />

                  <span>Pending</span>

                  <span
                    className={`flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      statusFilter === "PENDING"
                        ? "bg-[#b98220] text-white"
                        : "bg-[#eeeae2] text-slate"
                    }`}
                  >
                    {pendingCount}
                  </span>
                </button>
              </div>
            </div>
            <div className="p-4 lg:p-5">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-brick-100 bg-brick-100 px-3 py-2.5 text-sm text-brick-600">
                  <AlertCircle size={16} strokeWidth={2} />

                  <span>{error}</span>
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-[250px] animate-pulse rounded-xl border border-line bg-[#faf9f6]"
                    />
                  ))}
                </div>
              ) : approvals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#dcd6ca] bg-[#fcfbf8] py-16 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#e4dac7] bg-[#f5ecdc] text-[#a87820]">
                    <CheckCircle2 size={20} strokeWidth={1.8} />
                  </div>

                  <p className="text-sm font-semibold text-ink">
                    All caught up
                  </p>

                  <p className="mt-1 text-xs text-slate">
                    No approval requests found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
                  {approvals.map((a) => {
                    const isPending = a.status === "PENDING";
                    const isBusy = busyId === a.id;

                    return (
                      <article
                        key={a.id}
                        className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-[#ddd7cb] bg-white transition-all duration-150 hover:-translate-y-[1px] hover:border-[#cfc5b5] hover:shadow-[0_6px_22px_rgba(40,35,25,0.06)]"
                      >
                        <div className="bg-[#fcfbf8] px-4 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                                <Link
                                  href={`/bookings/${a.booking}`}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-[#e8dec9] bg-[#f5eedf] px-2 py-1 font-mono text-[10px] font-semibold text-[#986d20] transition hover:bg-[#eee3cd]"
                                >
                                  <Ticket size={11} strokeWidth={2} />

                                  {a.booking_reference}
                                </Link>

                                {a.is_policy_violation && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#efd3cb] bg-[#fae8e3] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#ad4b35]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#ad4b35]" />
                                    Out of policy
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd7cc] bg-white text-slate">
                                  <UserRound size={15} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-semibold text-ink">
                                    {a.employee_name}
                                  </h3>

                                  <div className="mt-1 flex items-center gap-2 text-xs text-slate">
                                    <Layers3 size={13} strokeWidth={1.7} />

                                    <span>Level {a.level}</span>

                                    <span className="text-[#c7c0b4]">•</span>

                                    <span>{a.approver_role} approval</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 rounded-lg border border-[#e6e0d5] bg-white px-3 py-2 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate">
                                <WalletCards size={12} strokeWidth={1.8} />
                                Cost
                              </div>

                              <p className="mt-1 text-base font-semibold tracking-tight text-ink">
                                {formatCurrency(a.estimated_cost)}
                              </p>
                            </div>
                          </div>
                        </div>
                        {isPending ? (
                          <div className="mt-auto border-t border-[#e5e0d7] bg-[#fffdfa] px-4 py-3.5">
                            {/* Comment label */}
                            <label
                              htmlFor={`comment-${a.id}`}
                              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-ink"
                            >
                              <MessageSquare size={13} strokeWidth={1.8} />
                              Decision comment
                              <span className="font-normal text-slate">
                                (optional)
                              </span>
                            </label>

                            {/* Comment */}
                            <textarea
                              id={`comment-${a.id}`}
                              className="field-input w-full resize-none bg-white"
                              rows={2}
                              placeholder="Optional comment..."
                              value={comments[a.id] || ""}
                              disabled={isBusy}
                              onChange={(e) =>
                                setComments((c) => ({
                                  ...c,
                                  [a.id]: e.target.value,
                                }))
                              }
                            />

                            <div className="mt-2.5 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => decide(a, "REJECTED")}
                                disabled={isBusy}
                                className="btn-danger inline-flex min-w-[80px] items-center justify-center gap-1.5 px-3 text-xs"
                              >
                                <X size={13} strokeWidth={2} />

                                {isBusy ? "..." : "Reject"}
                              </button>

                              <button
                                type="button"
                                onClick={() => decide(a, "APPROVED")}
                                disabled={isBusy}
                                className="btn-accent inline-flex min-w-[82px] items-center justify-center gap-1.5 px-3 text-xs"
                              >
                                <CheckCircle2 size={13} strokeWidth={2} />

                                {isBusy ? "..." : "Approve"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-auto border-t border-[#e5e0d7] bg-[#fafaf8] px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                  a.status === "APPROVED"
                                    ? "bg-[#e8f3e9] text-[#287443]"
                                    : "bg-[#fae8e3] text-[#ad4b35]"
                                }`}
                              >
                                {a.status === "APPROVED" ? (
                                  <CheckCircle2 size={15} strokeWidth={2.4} />
                                ) : (
                                  <X size={15} strokeWidth={2.2} />
                                )}
                              </div>

                              <div>
                                <p className="text-xs text-slate">
                                  Already{" "}
                                  <span className="font-semibold text-ink">
                                    {a.status.toLowerCase()}
                                  </span>
                                  {a.approver_name
                                    ? ` by ${a.approver_name}`
                                    : ""}
                                  .
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
