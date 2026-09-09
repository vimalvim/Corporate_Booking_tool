'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { DepartmentBudget, Paginated } from '@/types';

const BudgetSchema = Yup.object({
  department: Yup.string().required('Required'),
  fiscal_year: Yup.string().matches(/^\d{4}-\d{4}$/, 'Format: 2026-2027').required('Required'),
  allocated_amount: Yup.number().typeError('Enter a number.').positive().required('Required'),
});

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await apiGet<Paginated<DepartmentBudget>>('/budget/', { page_size: 50 });
    if (res.state && res.data) setBudgets(res.data.results);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Topbar title="Budget management" subtitle="Departmental travel budgets and live utilization." />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {budgets.map((b) => (
            <div key={b.id} className="panel p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-base">{b.department}</h3>
                <span className="text-xs text-slate font-mono">{b.fiscal_year}</span>
              </div>
              <div className="text-sm text-slate mb-3">
                {formatCurrency(b.used_amount)} used of {formatCurrency(b.allocated_amount)}
              </div>
              <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                <div
                  className={`h-full ${b.utilization_percent > 90 ? 'bg-brick' : b.utilization_percent > 70 ? 'bg-brass' : 'bg-teal'}`}
                  style={{ width: `${Math.min(100, b.utilization_percent)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate mt-1.5">
                <span>{b.utilization_percent}% utilized</span>
                <span>{formatCurrency(b.remaining_amount)} remaining</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
          {showForm ? 'Close' : '+ Add / update department budget'}
        </button>

        {showForm && (
          <div className="panel p-5">
            <Formik
              initialValues={{ department: '', fiscal_year: '2026-2027', allocated_amount: '' }}
              validationSchema={BudgetSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setError(null);
                const res = await apiPost('/budget/', values);
                setSubmitting(false);
                if (res.state) { resetForm(); load(); setShowForm(false); }
                else setError(res.message || 'Could not save this budget.');
              }}
            >
              {({ isSubmitting }) => (
                <Form className="grid sm:grid-cols-3 gap-4" noValidate>
                  <div>
                    <label className="field-label">Department</label>
                    <Field name="department" className="field-input" placeholder="Engineering" />
                    <ErrorMessage name="department" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Fiscal year</label>
                    <Field name="fiscal_year" className="field-input" placeholder="2026-2027" />
                    <ErrorMessage name="fiscal_year" component="div" className="field-error" />
                  </div>
                  <div>
                    <label className="field-label">Allocated amount (₹)</label>
                    <Field name="allocated_amount" type="number" className="field-input" placeholder="2000000" />
                    <ErrorMessage name="allocated_amount" component="div" className="field-error" />
                  </div>
                  <div className="sm:col-span-3">
                    {error && <p className="field-error mb-2">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Saving…' : 'Save budget'}
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
