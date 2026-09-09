'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { ApprovalMatrixRule, Paginated } from '@/types';

const RuleSchema = Yup.object({
  level: Yup.number().typeError('Enter a number.').min(1).required('Required'),
  min_amount: Yup.number().typeError('Enter a number.').min(0).required('Required'),
  max_amount: Yup.number().typeError('Enter a number.').nullable(),
  approver_role: Yup.string().oneOf(['MANAGER', 'FINANCE', 'ADMIN']).required('Required'),
  applies_to_violation_only: Yup.boolean(),
});

export default function ApprovalMatrixPage() {
  const [rules, setRules] = useState<ApprovalMatrixRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await apiGet<Paginated<ApprovalMatrixRule>>('/approvals/matrix/', { page_size: 50 });
    if (res.state && res.data) setRules(res.data.results);
  };

  useEffect(() => { load(); }, []);

  const removeRule = async (id: number) => {
    if (!confirm('Remove this approval matrix rule?')) return;
    await apiDelete(`/approvals/matrix/${id}/`);
    load();
  };

  return (
    <>
      <Topbar title="Approval matrix" subtitle="Configure which approver role signs off at each amount band, in order." />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate bg-black/[0.02] border-b border-line">
                <th className="py-2.5 px-4 font-medium">Level</th>
                <th className="py-2.5 px-4 font-medium">Amount band</th>
                <th className="py-2.5 px-4 font-medium">Approver role</th>
                <th className="py-2.5 px-4 font-medium">Applies to</th>
                <th className="py-2.5 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rules.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 px-4">Level {r.level}</td>
                  <td className="py-2.5 px-4">{formatCurrency(r.min_amount)} – {r.max_amount ? formatCurrency(r.max_amount) : 'No limit'}</td>
                  <td className="py-2.5 px-4">{r.approver_role}</td>
                  <td className="py-2.5 px-4">{r.applies_to_violation_only ? 'Out-of-policy only' : 'All bookings'}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button onClick={() => removeRule(r.id)} className="text-xs text-brick hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && <tr><td colSpan={5} className="py-4 px-4 text-slate">No rules configured. Every booking will fall back to a single manager approval.</td></tr>}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
          {showForm ? 'Close' : '+ Add approval rule'}
        </button>

        {showForm && (
          <div className="panel p-5">
            <Formik
              initialValues={{ level: (rules.at(-1)?.level ?? 0) + 1, min_amount: 0, max_amount: '', approver_role: 'FINANCE', applies_to_violation_only: false }}
              validationSchema={RuleSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setError(null);
                const payload = { ...values, max_amount: values.max_amount === '' ? null : values.max_amount };
                const res = await apiPost('/approvals/matrix/', payload);
                setSubmitting(false);
                if (res.state) { resetForm(); load(); setShowForm(false); }
                else setError(res.message || 'Could not save this rule.');
              }}
            >
              {({ isSubmitting }) => (
                <Form className="grid sm:grid-cols-2 gap-4" noValidate>
                  <div>
                    <label className="field-label">Level (order in chain)</label>
                    <Field name="level" type="number" min={1} className="field-input" />
                    <ErrorMessage name="level" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Approver role</label>
                    <Field name="approver_role" as="select" className="field-input">
                      <option value="MANAGER">Reporting Manager</option>
                      <option value="FINANCE">Finance</option>
                      <option value="ADMIN">Admin</option>
                    </Field>
                  </div>
                  <div>
                    <label className="field-label">Minimum amount (₹)</label>
                    <Field name="min_amount" type="number" className="field-input" />
                    <ErrorMessage name="min_amount" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Maximum amount (₹, optional)</label>
                    <Field name="max_amount" type="number" className="field-input" placeholder="No limit" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <Field type="checkbox" name="applies_to_violation_only" id="violation_only" className="h-4 w-4" />
                    <label htmlFor="violation_only" className="text-sm">Only trigger this level for out-of-policy bookings</label>
                  </div>
                  <div className="sm:col-span-2">
                    {error && <p className="field-error mb-2">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Saving…' : 'Save rule'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  );
}
