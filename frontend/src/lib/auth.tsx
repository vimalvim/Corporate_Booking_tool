'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from './api';
import { setTokens, clearTokens, getAccessToken } from './auth-tokens';
import type { Role, User } from '@/types';

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      const res = await apiGet<User>('/auth/me/');
      if (res.state && res.data) setUser(res.data);
      else clearTokens();
      setLoading(false);
    };
    bootstrap();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await apiPost<LoginResponse>('/auth/login/', { username, password });
    if (res.state && res.data) {
      setTokens(res.data.access, res.data.refresh);
      setUser(res.data.user);
      return { ok: true };
    }
    return { ok: false, message: res.message || 'Invalid username or password.' };
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/**
 * Client-side RBAC gate for hiding nav items / page content from roles that
 * shouldn't see them. This is a UX convenience only — the Django API
 * enforces the real permission on every endpoint (core/permissions.py), so
 * a user can never *act* on something this component happens to hide.
 */
export function RoleGuard({ allow, children, fallback = null }: { allow: Role[]; children: ReactNode; fallback?: ReactNode }) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}

/** Redirects to /login if not authenticated; use inside the (app) layout. */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);
  return { user, loading };
}
