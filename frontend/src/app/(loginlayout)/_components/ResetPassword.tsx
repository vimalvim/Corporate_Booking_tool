'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth';
import RouteMap from '@/components/RouteMap';

const ResetSchema = Yup.object({
  new_password: Yup.string().min(8, 'At least 8 characters.').required('New password is required.'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], "Passwords don't match.")
    .required('Please confirm your password.'),
});

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-paper p-12">
        <div className="font-display text-lg tracking-tight">Corporate Travel Booking Tool</div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl leading-tight mb-4">
            One more step and you&apos;re back on the itinerary.
          </h1>
          <p className="text-paper/70 text-sm leading-relaxed mb-8">
            Choose a new password to finish resetting your account.
          </p>
          <RouteMap />
        </div>
        <div className="text-paper/50 text-xs font-mono">Prototype build · mock data</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl mb-1">Reset password</h2>
          <p className="text-slate text-sm mb-8">Set a new password for your account.</p>

          {!uid || !token ? (
            <div className="rounded border border-brick-100 bg-brick-100 px-3 py-2 text-sm text-brick-600">
              This reset link is missing or malformed. Please request a new one.
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="rounded border border-teal-100 bg-teal-100 px-3 py-3 text-sm text-teal-600">
                Password changed successfully.
              </div>
              <button type="button" className="btn-primary w-full" onClick={() => router.replace('/login')}>
                Go to sign in
              </button>
            </div>
          ) : (
            <Formik
              initialValues={{ new_password: '', confirm_password: '' }}
              validationSchema={ResetSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setFormError(null);
                const result = await resetPassword(uid, token, values.new_password);
                setSubmitting(false);
                if (result.ok) setSuccess(true);
                else setFormError(result.message || 'Could not reset password.');
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4" noValidate>
                  <div>
                    <label className="field-label" htmlFor="new_password">New password</label>
                    <Field id="new_password" name="new_password" type="password" className="field-input" placeholder="At least 8 characters" />
                    <ErrorMessage name="new_password" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="confirm_password">Confirm new password</label>
                    <Field id="confirm_password" name="confirm_password" type="password" className="field-input" placeholder="••••••••" />
                    <ErrorMessage name="confirm_password" component="div" className="field-error" />
                  </div>

                  {formError && (
                    <div className="rounded border border-brick-100 bg-brick-100 px-3 py-2 text-sm text-brick-600">
                      {formError}
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                    {isSubmitting ? 'Resetting…' : 'Reset password'}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <p className="text-sm text-slate text-center mt-6">
            <Link href="/login" className="text-ink font-medium hover:text-brass">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}