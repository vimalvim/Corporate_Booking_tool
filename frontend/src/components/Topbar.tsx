'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/format';

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-4">
      <div>
        <h1 className="font-display text-xl">{title}</h1>
        {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium leading-tight">{user.first_name} {user.last_name}</div>
            <div className="text-xs text-slate leading-tight">{ROLE_LABELS[user.role]} · {user.employee_code}</div>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="btn-outline text-xs"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
