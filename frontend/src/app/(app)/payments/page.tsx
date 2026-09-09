'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/format';
import type { Payment, PaymentMethod, Booking, Paginated } from '@/types';

const PaymentSchema = Yup.object({
  booking: Yup.number().typeError('Pick a booking.').required('Required'),
  method: Yup.number().typeError('Pick a payment method.').required('Required'),
  amount: Yup.number().typeError('Enter a number.').positive().required('Required'),
  transaction_ref: Yup.string(),
});

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [pRes, mRes, bRes] = await Promise.all([
      apiGet<Paginated<Payment>>('/payments/', { page_size: 50 }),
      apiGet<Paginated<PaymentMethod>>('/payments/methods/', { page_size: 50 }),
      apiGet<Paginated<Booking>>('/bookings/', { status: 'APPROVED', page_size: 50 }),
    ]);
    if (pRes.state && pRes.data) setPayments(pRes.data.results);
    if (mRes.state && mRes.data) setMethods(mRes.data.results);
    if (bRes.state && bRes.data) setApprovedBookings(bRes.data.results);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Topbar title="Payments" subtitle="Settle approved bookings against a corporate card, cash advance or direct billing." />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate bg-black/[0.02] border-b border-line">
                <th className="py-2.5 px-4 font-medium">Booking</th>
                <th className="py-2.5 px-4 font-medium">Method</th>
                <th className="py-2.5 px-4 font-medium">Amount</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Paid at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="py-4 px-4 text-slate">No payments recorded yet.</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 px-4 font-mono text-xs text-brass">{p.booking_reference}</td>
                  <td className="py-2.5 px-4">{p.method_label}</td>
                  <td className="py-2.5 px-4">{formatCurrency(p.amount)}</td>
                  <td className="py-2.5 px-4"><span className="pill bg-teal-100 text-teal-600">{p.status}</span></td>
                  <td className="py-2.5 px-4 text-slate">{formatDateTime(p.paid_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
          {showForm ? 'Close' : '+ Record a payment'}
        </button>

        {showForm && (
          <div className="panel p-5">
            {approvedBookings.length === 0 ? (
              <p className="text-sm text-slate">No approved bookings are awaiting payment right now.</p>
            ) : (
              <Formik
                initialValues={{ booking: approvedBookings[0]?.id ?? '', method: methods[0]?.id ?? '', amount: approvedBookings[0]?.estimated_cost ?? '', transaction_ref: '' }}
                validationSchema={PaymentSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  setError(null);
                  const res = await apiPost('/payments/', values);
                  setSubmitting(false);
                  if (res.state) { resetForm(); load(); setShowForm(false); }
                  else setError(res.message || 'Could not record this payment.');
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid sm:grid-cols-2 gap-4" noValidate>
                    <div>
                      <label className="field-label">Booking</label>
                      <Field
                        name="booking"
                        as="select"
                        className="field-input"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const bookingId = Number(e.target.value);
                          setFieldValue('booking', bookingId);
                          const b = approvedBookings.find((bk) => bk.id === bookingId);
                          if (b) setFieldValue('amount', b.estimated_cost);
                        }}
                      >
                        {approvedBookings.map((b) => (
                          <option key={b.id} value={b.id}>{b.reference} — {b.employee_name} ({formatCurrency(b.estimated_cost)})</option>
                        ))}
                      </Field>
                      <ErrorMessage name="booking" component="div" className="field-error" />
                    </div>
                    <div>
                      <label className="field-label">Payment method</label>
                      <Field name="method" as="select" className="field-input">
                        {methods.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </Field>
                      <ErrorMessage name="method" component="div" className="field-error" />
                    </div>
                    <div>
                      <label className="field-label">Amount (₹)</label>
                      <Field name="amount" type="number" className="field-input" />
                      <ErrorMessage name="amount" component="div" className="field-error" />
                    </div>
                    <div>
                      <label className="field-label">Transaction reference (optional)</label>
                      <Field name="transaction_ref" className="field-input" placeholder="e.g. TXN-88213" />
                    </div>
                    <div className="sm:col-span-2">
                      {error && <p className="field-error mb-2">{error}</p>}
                      <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'Recording…' : 'Record payment'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        )}
      </div>
    </>
  );
}
