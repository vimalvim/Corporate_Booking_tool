const ACCESS_KEY = 'ctb_access_token';
const REFRESH_KEY = 'ctb_refresh_token';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_KEY);
};

export const setTokens = (access: string, refresh: string) => {
  window.localStorage.setItem(ACCESS_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
};

/** Calls Django's /api/auth/refresh/ with the stored refresh token. Returns
 * true and stores the new access token on success. */
export const refreshAccessToken = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    window.localStorage.setItem(ACCESS_KEY, data.access);
    return true;
  } catch {
    return false;
  }
};
