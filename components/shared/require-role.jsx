'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Redirects to /dashboard if the current user doesn't have one of the allowed roles.
 * @param {React.ReactNode} children
 * @param {string | string[]} role - Required role(s); user needs at least one.
 */
export function RequireRole({ children, role }) {
  const { hasRole, loading } = useAuth();
  const router = useRouter();
  const allowed = hasRole(role);

  useEffect(() => {
    if (loading) return;
    if (!allowed) router.replace('/dashboard');
  }, [loading, allowed, router]);

  if (loading) return null;
  if (!allowed) return null;
  return children;
}
