/**
 * Global API client.
 *
 * Every page/component calls the backend exclusively through the
 * `apiGet/apiPost/apiPut/apiPatch/apiDelete` helpers below instead of
 * calling `fetch` directly, so auth headers, retries, timeouts and error
 * shape are handled in exactly one place.
 *
 * This follows the same unified-handler shape as the reference `api.ts`
 * (single `handleRequest`, GET retry/backoff, request timeout, consistent
 * `{state, statusCode, message}` response envelope). What's *not* carried
 * over: `next/headers()` cookie reading, HMAC request signing, and
 * `permanentRedirect` — those exist in the reference file because it runs
 * as a Next.js Server Action against a same-organisation cookie-session
 * backend. This app is a plain browser SPA talking to a separate Django
 * REST API over a JWT Bearer token, so auth is a header we attach
 * ourselves (see getAccessToken below) and a 401 is handled by refreshing
 * the token client-side rather than by redirecting a server response.
 */
import { getAccessToken, refreshAccessToken, clearTokens } from './auth-tokens';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const DEFAULT_TIMEOUT_MS = 15_000;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 502, 503, 504]);
const MAX_GET_RETRIES = 2;
const RETRY_BACKOFF_MS = [300, 900];

export interface ApiResponse<T> {
  state: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]> | string;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  isRetry?: boolean; // internal flag to stop infinite refresh loops
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildQueryString = (params?: RequestOptions['params']) => {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (!entries.length) return '';
  const usp = new URLSearchParams();
  entries.forEach(([k, v]) => usp.append(k, String(v)));
  return `?${usp.toString()}`;
};

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

async function handleRequest<T>(
  endpoint: string,
  method: Method,
  body?: unknown,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}${method === 'GET' ? buildQueryString(options.params) : ''}`;
    const accessToken = getAccessToken();

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    };

    let response = await fetchWithTimeout(url, requestInit, DEFAULT_TIMEOUT_MS);

    // Access token expired mid-session: refresh once and replay the request.
    if (response.status === 401 && !options.isRetry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return handleRequest<T>(endpoint, method, body, { ...options, isRetry: true });
      }
      clearTokens();
      return { state: false, statusCode: 401, message: 'Session expired. Please sign in again.' };
    }

    if (method === 'GET') {
      for (let attempt = 0; RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_GET_RETRIES; attempt++) {
        await wait(RETRY_BACKOFF_MS[attempt] ?? RETRY_BACKOFF_MS.at(-1)!);
        response = await fetchWithTimeout(url, requestInit, DEFAULT_TIMEOUT_MS);
      }
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await response.json().catch(() => undefined) : undefined;

    if (!response.ok) {
      return {
        state: false,
        statusCode: response.status,
        message: extractErrorMessage(payload) || 'An error occurred during the request.',
        errors: payload,
      };
    }

    return { state: true, statusCode: response.status, data: payload as T };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { state: false, statusCode: 408, message: 'Request timed out.' };
    }
    return { state: false, statusCode: 500, message: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

function extractErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const obj = payload as Record<string, unknown>;
  if (typeof obj.detail === 'string') return obj.detail;
  if (typeof obj.message === 'string') return obj.message;
  const firstArrayField = Object.values(obj).find((v) => Array.isArray(v) && typeof v[0] === 'string');
  if (firstArrayField) return (firstArrayField as string[])[0];
  return undefined;
}

export const apiGet = <T>(endpoint: string, params?: RequestOptions['params']) =>
  handleRequest<T>(endpoint, 'GET', undefined, { params });

export const apiPost = <T>(endpoint: string, body?: unknown) => handleRequest<T>(endpoint, 'POST', body);
export const apiPut = <T>(endpoint: string, body?: unknown) => handleRequest<T>(endpoint, 'PUT', body);
export const apiPatch = <T>(endpoint: string, body?: unknown) => handleRequest<T>(endpoint, 'PATCH', body);
export const apiDelete = <T>(endpoint: string) => handleRequest<T>(endpoint, 'DELETE');
