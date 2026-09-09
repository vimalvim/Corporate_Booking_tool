'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Topbar from '@/components/Topbar';
import { apiGet, apiPost } from '@/lib/api';
import { ROLE_LABELS } from '@/lib/format';
import type { User, Paginated, Role } from '@/types';

const ROLES: Role[] = ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'];

const UserSchema = Yup.object({
  username: Yup.string().required('Required'),
  employee_code: Yup.string().required('Required'),
  email: Yup.string().email('Enter a valid email.').required('Required'),
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  role: Yup.string().oneOf(ROLES).required('Required'),
  department: Yup.string().required('Required'),
  manager: Yup.number().nullable(),
  password: Yup.string().min(8, 'At least 8 characters.').required('Required'),
});

export default function EmployeeMappingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await apiGet<Paginated<User>>('/auth/users/', { page_size: 100 });
    if (res.state && res.data) setUsers(res.data.results);
  };

  useEffect(() => { load(); }, []);

  const managers = users.filter((u) => u.role === 'MANAGER');

  return (
    <>
      <Topbar title="Employee mapping & profiles" subtitle="Create employees, assign roles and reporting managers." />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate bg-black/[0.02] border-b border-line">
                <th className="py-2.5 px-4 font-medium">Code</th>
                <th className="py-2.5 px-4 font-medium">Name</th>
                <th className="py-2.5 px-4 font-medium">Role</th>
                <th className="py-2.5 px-4 font-medium">Department</th>
                <th className="py-2.5 px-4 font-medium">Reports to</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 px-4 font-mono text-xs">{u.employee_code}</td>
                  <td className="py-2.5 px-4">{u.first_name} {u.last_name}</td>
                  <td className="py-2.5 px-4">{ROLE_LABELS[u.role]}</td>
                  <td className="py-2.5 px-4">{u.department}</td>
                  <td className="py-2.5 px-4 text-slate">{u.manager_name || '—'}</td>
                  <td className="py-2.5 px-4">
                    <span className={`pill ${u.is_active_employee ? 'bg-teal-100 text-teal-600' : 'bg-black/5 text-slate'}`}>
                      {u.is_active_employee ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
          {showForm ? 'Close' : '+ Add employee'}
        </button>

        {showForm && (
          <div className="panel p-5">
            <Formik
              initialValues={{
                username: '', employee_code: '', email: '', first_name: '', last_name: '',
                role: 'EMPLOYEE' as Role, department: '', manager: '', password: '',
              }}
              validationSchema={UserSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setError(null);
                const payload = { ...values, manager: values.manager || null };
                const res = await apiPost('/auth/users/', payload);
                setSubmitting(false);
                if (res.state) { resetForm(); load(); setShowForm(false); }
                else setError(res.message || 'Could not create this employee.');
              }}
            >
              {({ isSubmitting }) => (
                <Form className="grid sm:grid-cols-3 gap-4" noValidate>
                  <div><label className="field-label">Username</label><Field name="username" className="field-input" /><ErrorMessage name="username" component="div" className="field-error" /></div>
                  <div><label className="field-label">Employee code</label><Field name="employee_code" className="field-input" placeholder="EMP301" /><ErrorMessage name="employee_code" component="div" className="field-error" /></div>
                  <div><label className="field-label">Email</label><Field name="email" type="email" className="field-input" /><ErrorMessage name="email" component="div" className="field-error" /></div>
                  <div><label className="field-label">First name</label><Field name="first_name" className="field-input" /><ErrorMessage name="first_name" component="div" className="field-error" /></div>
                  <div><label className="field-label">Last name</label><Field name="last_name" className="field-input" /><ErrorMessage name="last_name" component="div" className="field-error" /></div>
                  <div>
                    <label className="field-label">Role</label>
                    <Field name="role" as="select" className="field-input">
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </Field>
                  </div>
                  <div><label className="field-label">Department</label><Field name="department" className="field-input" /><ErrorMessage name="department" component="div" className="field-error" /></div>
                  <div>
                    <label className="field-label">Reports to (manager)</label>
                    <Field name="manager" as="select" className="field-input">
                      <option value="">None</option>
                      {managers.map((m) => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                    </Field>
                  </div>
                  <div><label className="field-label">Temporary password</label><Field name="password" type="password" className="field-input" /><ErrorMessage name="password" component="div" className="field-error" /></div>
                  <div className="sm:col-span-3">
                    {error && <p className="field-error mb-2">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Creating…' : 'Create employee'}
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
