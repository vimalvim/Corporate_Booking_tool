'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth';

const LoginSchema = Yup.object({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.'),
});

const DEMO_ACCOUNTS = [
  { label: 'Employee', username: 'vimal.emp' },
  { label: 'Manager', username: 'karthik.mgr' },
  { label: 'Finance', username: 'finance' },
  { label: 'Admin', username: 'admin' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-paper p-12">
        <div className="font-display text-lg tracking-tight">Corporate Travel Booking Tool</div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl leading-tight mb-4">
            Every trip, checked against policy before it&apos;s approved.
          </h1>
          <p className="text-paper/70 text-sm leading-relaxed">
            Request, validate, approve and pay for corporate travel in one place —
            with budgets, policy rules and the approval matrix enforced automatically.
          </p>
        </div>
        <div className="text-paper/50 text-xs font-mono">Prototype build · mock data</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl mb-1">Sign in</h2>
          <p className="text-slate text-sm mb-8">Use one of the demo accounts below, or your own credentials.</p>

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setFormError(null);
              const result = await login(values.username, values.password);
              setSubmitting(false);
              if (result.ok) router.replace('/dashboard');
              else setFormError(result.message || 'Login failed.');
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4" noValidate>
                <div>
                  <label className="field-label" htmlFor="username">Username</label>
                  <Field id="username" name="username" className="field-input" placeholder="e.g. vimal.emp" />
                  <ErrorMessage name="username" component="div" className="field-error" />
                </div>
                <div>
                  <label className="field-label" htmlFor="password">Password</label>
                  <Field id="password" name="password" type="password" className="field-input" placeholder="••••••••" />
                  <ErrorMessage name="password" component="div" className="field-error" />
                </div>

                {formError && (
                  <div className="rounded border border-brick-100 bg-brick-100 px-3 py-2 text-sm text-brick-600">
                    {formError}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>

                <div className="pt-4 border-t border-line">
                  <p className="text-xs text-slate mb-2">Demo accounts (password: Passw0rd!123)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.username}
                        type="button"
                        onClick={() => {
                          setFieldValue('username', acc.username);
                          setFieldValue('password', 'Passw0rd!123');
                        }}
                        className="btn-outline text-xs justify-start"
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
