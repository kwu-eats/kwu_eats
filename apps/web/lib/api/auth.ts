import type { AdminLoginResponse } from '@pangchelin/types';

import { apiFetch } from './client';

export function login(email: string, password: string): Promise<AdminLoginResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
