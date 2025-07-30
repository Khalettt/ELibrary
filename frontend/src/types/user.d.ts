// src/types/user.d.ts
export interface User {
  id: number;
  name?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING_ADMIN_APPROVAL' | 'REJECTED';
  createdAt: string;
}