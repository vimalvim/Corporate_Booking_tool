'use client';

import Sidebar from '@/components/Sidebar';
import { useRequireAuth } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-slate text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
