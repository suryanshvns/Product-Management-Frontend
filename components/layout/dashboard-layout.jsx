'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Breadcrumb } from './breadcrumb';
import { post, getRefreshToken, clearAuth, getAuthToken } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { PageShimmer } from '@/components/shared/skeleton';

export function DashboardLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading, loadUser } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!getAuthToken()) {
      router.replace('/login');
      return;
    }
  }, [mounted, router]);

  useEffect(() => {
    if (!mounted) return;
    if (getAuthToken() && user === null && !authLoading) {
      loadUser();
    }
  }, [mounted, user, authLoading, loadUser]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      toast({
        title: 'Logout failed',
        description: err?.message,
        variant: 'destructive',
      });
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex gap-4 p-6">
          <div className="h-10 w-32 rounded-md bg-muted animate-shimmer" />
          <div className="h-10 flex-1 rounded-md bg-muted animate-shimmer" />
        </div>
        <div className="flex-1 p-6">
          <PageShimmer />
        </div>
      </div>
    );
  }
  if (!getAuthToken()) return null;
  if (authLoading && !user) return <PageShimmer />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user ?? { name: 'User', email: '' }}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
        <main className="flex-1 overflow-auto scrollbar-thin">
          <div className="container mx-auto max-w-7xl space-y-8 p-6">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
