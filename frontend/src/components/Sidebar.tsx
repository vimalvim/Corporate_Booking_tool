'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/types';
import clsx from 'clsx';
import { useState } from 'react';

import {
  LayoutDashboard,
  Plane,
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  TriangleAlert,
  UsersRound,
  Building2,
  Landmark,
  WalletCards,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  GitBranch,
  BarChart3,
  Settings,
  ClipboardList,
  Menu,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: 'Travel',
    items: [
      {
        href: '/bookings/search',
        label: 'Search & Book',
        roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
        icon: Plane,
      },
      {
        href: '/trips',
        label: 'My Trips',
        roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
        icon: BriefcaseBusiness,
      },
      {
        href: '/requests',
        label: 'Requests',
        roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
        icon: FileText,
      },
      {
        href: '/approvals',
        label: 'Approvals',
        roles: ['MANAGER', 'FINANCE', 'ADMIN'],
        icon: CheckCircle2,
      },
      {
        href: '/exceptions',
        label: 'Exceptions',
        roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'],
        icon: TriangleAlert,
      },
    ],
  },

  {
    title: 'Organization',
    items: [
      {
        href: '/employees',
        label: 'Employees',
        roles: ['MANAGER', 'FINANCE', 'ADMIN'],
        icon: UsersRound,
      },
      {
        href: '/departments',
        label: 'Departments',
        roles: ['FINANCE', 'ADMIN'],
        icon: Building2,
      },
      {
        href: '/cost-centers',
        label: 'Cost Centers',
        roles: ['FINANCE', 'ADMIN'],
        icon: Landmark,
      },
    ],
  },

  {
    title: 'Finance',
    items: [
      {
        href: '/budget',
        label: 'Budgets',
        roles: ['FINANCE', 'ADMIN'],
        icon: WalletCards,
      },
      {
        href: '/payments',
        label: 'Payment Methods',
        roles: ['FINANCE', 'ADMIN'],
        icon: CreditCard,
      },
      {
        href: '/transactions',
        label: 'Transactions',
        roles: ['FINANCE', 'ADMIN'],
        icon: ReceiptText,
      },
    ],
  },

  {
    title: 'Policy',
    items: [
      {
        href: '/policy',
        label: 'Travel Policies',
        roles: ['FINANCE', 'ADMIN'],
        icon: ShieldCheck,
      },
      {
        href: '/admin/approval-matrix',
        label: 'Approval Matrix',
        roles: ['ADMIN'],
        icon: GitBranch,
      },
    ],
  },

  {
    title: 'Analytics',
    items: [
      {
        href: '/analytics',
        label: 'Travel Analytics',
        roles: ['FINANCE', 'ADMIN'],
        icon: BarChart3,
      },
      {
        href: '/reports',
        label: 'MIS Reports',
        roles: ['FINANCE', 'ADMIN'],
        icon: FileText,
      },
    ],
  },

  {
    title: 'Admin',
    items: [
      {
        href: '/configuration',
        label: 'Configuration',
        roles: ['ADMIN'],
        icon: Settings,
      },
      {
        href: '/audit-logs',
        label: 'Audit Logs',
        roles: ['ADMIN'],
        icon: ClipboardList,
      },
      {
        href: '/architecture',
        label: 'Architecture',
        roles: ['ADMIN'],
        icon: Building2,
      },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* =====================================================
          TABLET + MOBILE HAMBURGER
          Desktop-la completely hidden
      ====================================================== */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        className="
          fixed
          left-4
          top-4
          z-[2147483647]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          border
          border-line
          bg-[#F7F5EF]
          text-ink
          shadow-md
          lg:hidden
        "
      >
        <Menu size={22} strokeWidth={2} />
      </button>


      {/* =====================================================
          TABLET + MOBILE OVERLAY

          Outside click panna sidebar close aagum
      ====================================================== */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-[2147483646]
            bg-black/30
            lg:hidden
          "
        />
      )}


      {/* =====================================================
          TABLET + MOBILE SIDEBAR
          Desktop-la hidden
      ====================================================== */}
      <aside
        className={clsx(
          `
            fixed
            left-0
            top-0
            z-[2147483647]
            flex
            h-screen
            w-64
            shrink-0
            flex-col
            border-r
            border-line
            bg-[#F7F5EF]
            text-ink
            transition-transform
            duration-200
            lg:hidden
          `,
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        )}
      >

        {/* ================= BRAND ================= */}
        <div className="shrink-0 border-b border-line bg-[#F7F5EF] px-5 py-5">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper shadow-sm">
              <Plane
                size={18}
                strokeWidth={2}
              />
            </div>

            <div>
              <div className="font-display text-[15px] font-semibold leading-tight text-ink">
                Corporate Travel
              </div>

              <div className="mt-0.5 text-[11px] text-slate">
                Booking Tool
              </div>
            </div>

          </div>
        </div>


        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {NAV_SECTIONS.map((section) => {

            const visibleItems = section.items.filter((item) =>
              item.roles.includes(user.role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div
                key={section.title}
                className="mb-7 last:mb-0"
              >

                {/* SECTION TITLE */}
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/70">
                  {section.title}
                </p>


                {/* MENU ITEMS */}
                <div className="space-y-1">

                  {visibleItems.map((item) => {

                    const active =
                      pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`);

                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',

                          active
                            ? 'bg-brass/10 font-medium text-ink shadow-sm'
                            : 'text-slate hover:bg-white hover:text-ink'
                        )}
                      >

                        <span
                          className={clsx(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',

                            active
                              ? 'bg-brass text-white shadow-sm'
                              : 'text-slate group-hover:bg-[#EEEAE0] group-hover:text-ink'
                          )}
                        >
                          <Icon
                            size={16}
                            strokeWidth={active ? 2.2 : 1.8}
                          />
                        </span>


                        <span className="flex-1">
                          {item.label}
                        </span>


                        {/* EXISTING ACTIVE DOT */}
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                        )}

                      </Link>
                    );
                  })}

                </div>

              </div>
            );
          })}

        </nav>

      </aside>


      {/* =====================================================
          DESKTOP SIDEBAR
          ORIGINAL DESKTOP - NO CHANGE
      ====================================================== */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-[#F7F5EF] text-ink lg:flex">

        {/* ================= BRAND ================= */}
        <div className="shrink-0 border-b border-line bg-[#F7F5EF] px-5 py-5">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper shadow-sm">
              <Plane
                size={18}
                strokeWidth={2}
              />
            </div>

            <div>
              <div className="font-display text-[15px] font-semibold leading-tight text-ink">
                Corporate Travel
              </div>

              <div className="mt-0.5 text-[11px] text-slate">
                Booking Tool
              </div>
            </div>

          </div>
        </div>


        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {NAV_SECTIONS.map((section) => {

            const visibleItems = section.items.filter((item) =>
              item.roles.includes(user.role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div
                key={section.title}
                className="mb-7 last:mb-0"
              >

                {/* SECTION TITLE */}
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/70">
                  {section.title}
                </p>


                {/* MENU ITEMS */}
                <div className="space-y-1">

                  {visibleItems.map((item) => {

                    const active =
                      pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`);

                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',

                          active
                            ? 'bg-brass/10 font-medium text-ink shadow-sm'
                            : 'text-slate hover:bg-white hover:text-ink'
                        )}
                      >

                        <span
                          className={clsx(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',

                            active
                              ? 'bg-brass text-white shadow-sm'
                              : 'text-slate group-hover:bg-[#EEEAE0] group-hover:text-ink'
                          )}
                        >
                          <Icon
                            size={16}
                            strokeWidth={active ? 2.2 : 1.8}
                          />
                        </span>


                        <span className="flex-1">
                          {item.label}
                        </span>


                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                        )}

                      </Link>
                    );
                  })}

                </div>

              </div>
            );
          })}

        </nav>

      </aside>
    </>
  );
}