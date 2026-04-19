export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: Admin;
}
