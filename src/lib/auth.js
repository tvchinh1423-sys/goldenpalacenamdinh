import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Lấy session phía server
export async function getSession() {
  return await getServerSession(authOptions);
}

// Kiểm tra quyền Admin
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

// Kiểm tra quyền Staff hoặc Admin
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized: Authentication required');
  }
  return session;
}

// Kiểm tra quyền sửa lead (chỉ lead được giao hoặc Admin)
export async function canEditLead(session, lead) {
  if (session.user.role === 'ADMIN') return true;
  if (lead.assignedTo === session.user.id) return true;
  return false;
}
