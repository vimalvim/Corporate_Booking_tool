'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiPost } from '@/lib/api';
import type { Booking, ItemType } from '@/types';

const ITEM_TYPES: ItemType[] = ['FLIGHT', 'HOTEL', 'TRAIN', 'CAB'];

const emptyItem = { item_type: 'FLIGHT' as ItemType, provider: '', class_or_category: '', details: '', cost: '', quantity: 1 };

const BookingSchema = Yup.object({
  trip_type: Yup.string().oneOf(['DOMESTIC', 'INTERNATIONAL']).required('Required'),
  purpose: Yup.string().min(5, 'Give a bit more detail (5+ characters).').required('Purpose is required.'),
  origin: Yup.string().required('Required'),
  destination: Yup.string().required('Required'),
  start_date: Yup.date().required('Required'),
  end_date: Yup.date()
    .required('Required')
    .min(Yup.ref('start_date'), 'End date cannot be before the start date.'),
  items: Yup.array()
    .of(
      Yup.object({
        item_type: Yup.string().required(),
        provider: Yup.string().required('Provider is required.'),
        class_or_category: Yup.string().required('Class / category is required.'),
        details: Yup.string(),
        cost: Yup.number().typeError('Enter a number.').positive('Must be greater than 0.').required('Cost is required.'),
        quantity: Yup.number().typeError('Enter a number.').integer().min(1).required(),
      })
    )
    .min(1, 'Add at least one travel item.'),
});

export default function NewBookingPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <>
      <Topbar title="New travel booking" subtitle="Add trip details and every flight, hotel, train or cab you need." />
      <div className="p-6 max-w-3xl">
        <Formik
          initialValues={{
            trip_type: 'DOMESTIC',
            purpose: '',
            origin: '',
            destination: '',
            start_date: '',
            end_date: '',
            items: [emptyItem],
          }}
          validationSchema={BookingSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError(null);
            const res = await apiPost<Booking>('/bookings/', values);
            setSubmitting(false);
            if (res.state && res.data) router.push(`/bookings/${res.data.id}`);
            else setFormError(res.message || 'Could not save this booking.');
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-6" noValidate>
              <section className="panel p-5 space-y-4">
                <h2 className="font-display text-base">Trip details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label" htmlFor="trip_type">Trip type</label>
                    <Field id="trip_type" name="trip_type" as="select" className="field-input">
                      <option value="DOMESTIC">Domestic</option>
                      <option value="INTERNATIONAL">International</option>
                    </Field>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="purpose">Purpose of travel</label>
                    <Field id="purpose" name="purpose" className="field-input" placeholder="e.g. Client workshop" />
                    <ErrorMessage name="purpose" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="origin">Origin city</label>
                    <Field id="origin" name="origin" className="field-input" placeholder="Chennai" />
                    <ErrorMessage name="origin" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="destination">Destination city</label>
                    <Field id="destination" name="destination" className="field-input" placeholder="Bengaluru" />
                    <ErrorMessage name="destination" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="start_date">Start date</label>
                    <Field id="start_date" name="start_date" type="date" className="field-input" />
                    <ErrorMessage name="start_date" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="end_date">End date</label>
                    <Field id="end_date" name="end_date" type="date" className="field-input" />
                    <ErrorMessage name="end_date" component="div" className="field-error" />
                  </div>
                </div>
              </section>

              <section className="panel p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base">Travel items</h2>
                </div>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.items.map((_, index) => (
                        <div key={index} className="border border-line rounded p-4 space-y-3 relative">
                          {values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="absolute top-3 right-3 text-xs text-brick hover:underline"
                            >
                              Remove
                            </button>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="field-label">Type</label>
                              <Field name={`items.${index}.item_type`} as="select" className="field-input">
                                {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                              </Field>
                            </div>
                            <div>
                              <label className="field-label">Provider</label>
                              <Field name={`items.${index}.provider`} className="field-input" placeholder="e.g. IndiGo, Taj" />
                              <ErrorMessage name={`items.${index}.provider`} component="div" className="field-error" />
                            </div>
                            <div>
                              <label className="field-label">Class / category</label>
                              <Field name={`items.${index}.class_or_category`} className="field-input" placeholder="e.g. ECONOMY, 3-star" />
                              <ErrorMessage name={`items.${index}.class_or_category`} component="div" className="field-error" />
                            </div>
                            <div>
                              <label className="field-label">Details</label>
                              <Field name={`items.${index}.details`} className="field-input" placeholder="e.g. flight no. / hotel name" />
                            </div>
                            <div>
                              <label className="field-label">Cost (₹)</label>
                              <Field name={`items.${index}.cost`} type="number" className="field-input" placeholder="0" />
                              <ErrorMessage name={`items.${index}.cost`} component="div" className="field-error" />
                            </div>
                            <div>
                              <label className="field-label">Quantity (e.g. nights)</label>
                              <Field name={`items.${index}.quantity`} type="number" min={1} className="field-input" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => push(emptyItem)} className="btn-outline text-sm">
                        + Add another item
                      </button>
                      {typeof values.items === 'object' && (
                        <ErrorMessage name="items" component="div" className="field-error" />
                      )}
                    </div>
                  )}
                </FieldArray>
              </section>

              {formError && (
                <div className="rounded border border-brick-100 bg-brick-100 px-4 py-3 text-sm text-brick-600">{formError}</div>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving…' : 'Save as draft'}
                </button>
                <p className="text-xs text-slate self-center">
                  You&apos;ll review policy compliance and submit for approval on the next screen.
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
