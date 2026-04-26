import { clientEnv, serverEnv } from '../../env';

function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return serverEnv.INTERNAL_API_URL ?? clientEnv.NEXT_PUBLIC_API_URL;
  }
  return clientEnv.NEXT_PUBLIC_API_URL;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  { token, ...options }: FetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${getBaseUrl()}${path}`, {
    cache: typeof window === 'undefined' ? 'no-store' : undefined,
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? '앗, 잠시 후 다시 시도해주세요');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
