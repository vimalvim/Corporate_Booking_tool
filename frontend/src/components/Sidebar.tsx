'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/types';
import clsx from 'clsx';

interface NavItem {
  href: string;
  label: string;
  roles: Role[]; // which roles see this item
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'] },
  { href: '/bookings', label: 'Travel bookings', roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'] },
  { href: '/approvals', label: 'Approvals', roles: ['MANAGER', 'FINANCE', 'ADMIN'] },
  { href: '/budget', label: 'Budget', roles: ['FINANCE', 'ADMIN'] },
  { href: '/policy', label: 'Travel policy', roles: ['FINANCE', 'ADMIN'] },
  { href: '/payments', label: 'Payments', roles: ['FINANCE', 'ADMIN'] },
  { href: '/reports', label: 'Reports & MIS', roles: ['FINANCE', 'ADMIN'] },
  { href: '/admin/employees', label: 'Employee mapping', roles: ['ADMIN'] },
  { href: '/admin/approval-matrix', label: 'Approval matrix', roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-ink text-paper">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="font-display text-base leading-tight">Corporate Travel</div>
        <div className="text-paper/50 text-xs">Booking Tool</div>
      </div>
      <nav className="flex-1 py-4 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-5 py-2 text-sm border-l-2 transition-colors',
                active
                  ? 'border-brass bg-white/5 text-paper font-medium'
                  : 'border-transparent text-paper/60 hover:text-paper hover:bg-white/5'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-xs text-paper/40 font-mono">
        v1.0.0 · demo data
      </div>
    </aside>
  );
}
