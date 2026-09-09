'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { TravelPolicy, Paginated } from '@/types';

const GRADES = ['L1', 'L2', 'L3', 'L4', 'L5'];
const FLIGHT_CLASSES = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];

const PolicySchema = Yup.object({
  name: Yup.string().required('Required'),
  grade: Yup.string().required('Required'),
  trip_type: Yup.string().oneOf(['DOMESTIC', 'INTERNATIONAL']).required('Required'),
  max_flight_class: Yup.string().required('Required'),
  max_flight_fare: Yup.number().typeError('Enter a number.').positive().required('Required'),
  max_hotel_category_stars: Yup.number().typeError('Enter a number.').min(1).max(5).required('Required'),
  max_hotel_price_per_night: Yup.number().typeError('Enter a number.').positive().required('Required'),
  advance_booking_days_required: Yup.number().typeError('Enter a number.').min(0).required('Required'),
});

export default function PolicyPage() {
  const [policies, setPolicies] = useState<TravelPolicy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await apiGet<Paginated<TravelPolicy>>('/policy/', { page_size: 50 });
    if (res.state && res.data) setPolicies(res.data.results);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Topbar title="Travel policy configuration" subtitle="Entitlement caps by grade and trip type. Bookings are checked against these automatically." />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate bg-black/[0.02] border-b border-line">
                <th className="py-2.5 px-4 font-medium">Policy</th>
                <th className="py-2.5 px-4 font-medium">Grade</th>
                <th className="py-2.5 px-4 font-medium">Trip type</th>
                <th className="py-2.5 px-4 font-medium">Max flight class</th>
                <th className="py-2.5 px-4 font-medium">Max flight fare</th>
                <th className="py-2.5 px-4 font-medium">Max hotel / night</th>
                <th className="py-2.5 px-4 font-medium">Advance booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {policies.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 px-4">{p.name}</td>
                  <td className="py-2.5 px-4">{p.grade}</td>
                  <td className="py-2.5 px-4">{p.trip_type}</td>
                  <td className="py-2.5 px-4">{p.max_flight_class.replace('_', ' ')}</td>
                  <td className="py-2.5 px-4">{formatCurrency(p.max_flight_fare)}</td>
                  <td className="py-2.5 px-4">{formatCurrency(p.max_hotel_price_per_night)} ({p.max_hotel_category_stars}★)</td>
                  <td className="py-2.5 px-4">{p.advance_booking_days_required} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
          {showForm ? 'Close' : '+ Add policy rule'}
        </button>

        {showForm && (
          <div className="panel p-5">
            <Formik
              initialValues={{
                name: '', grade: 'L2', trip_type: 'DOMESTIC', max_flight_class: 'ECONOMY',
                max_flight_fare: '', max_hotel_category_stars: 3, max_hotel_price_per_night: '',
                advance_booking_days_required: 3,
              }}
              validationSchema={PolicySchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setError(null);
                const res = await apiPost('/policy/', values);
                setSubmitting(false);
                if (res.state) { resetForm(); load(); setShowForm(false); }
                else setError(res.message || 'Could not save this policy.');
              }}
            >
              {({ isSubmitting }) => (
                <Form className="grid sm:grid-cols-3 gap-4" noValidate>
                  <div className="sm:col-span-3">
                    <label className="field-label">Policy name</label>
                    <Field name="name" className="field-input" placeholder="L2 Domestic Policy" />
                    <ErrorMessage name="name" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Grade</label>
                    <Field name="grade" as="select" className="field-input">
                      {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </Field>
                  </div>
                  <div>
                    <label className="field-label">Trip type</label>
                    <Field name="trip_type" as="select" className="field-input">
                      <option value="DOMESTIC">Domestic</option>
                      <option value="INTERNATIONAL">International</option>
                    </Field>
                  </div>
                  <div>
                    <label className="field-label">Max flight class</label>
                    <Field name="max_flight_class" as="select" className="field-input">
                      {FLIGHT_CLASSES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </Field>
                  </div>
                  <div>
                    <label className="field-label">Max flight fare (₹)</label>
                    <Field name="max_flight_fare" type="number" className="field-input" />
                    <ErrorMessage name="max_flight_fare" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Max hotel stars</label>
                    <Field name="max_hotel_category_stars" type="number" min={1} max={5} className="field-input" />
                  </div>
                  <div>
                    <label className="field-label">Max hotel price / night (₹)</label>
                    <Field name="max_hotel_price_per_night" type="number" className="field-input" />
                    <ErrorMessage name="max_hotel_price_per_night" component="div" className="field-error" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="field-label">Advance booking days required</label>
                    <Field name="advance_booking_days_required" type="number" min={0} className="field-input w-32" />
                  </div>
                  <div className="sm:col-span-3">
                    {error && <p className="field-error mb-2">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Saving…' : 'Save policy'}
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
