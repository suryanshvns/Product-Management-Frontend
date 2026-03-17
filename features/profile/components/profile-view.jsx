'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, CreditCard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { PageShimmer } from '@/components/shared/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { get, getAuthToken } from '@/lib/apiClient';

export function ProfileView() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await get('/auth/me');
      const u = response?.data?.user ?? response?.user ?? null;
      setUser(u);
    } catch {
      setError(true);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <PageShimmer />;

  const hasToken = typeof window !== 'undefined' && getAuthToken();
  if ((error || !user) && !hasToken) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={User}
          title="Profile"
          description="Your account details."
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-sm text-muted-foreground">
              You need to sign in to view your profile.
            </p>
            <Button variant="default" onClick={() => router.push('/login')}>
              Go to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={User}
          title="Profile"
          description="Your account details."
        />
        <ErrorState onRetry={fetchProfile} />
      </div>
    );
  }

  const initials =
    user.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <div className="space-y-6">
      <PageHeader
        icon={User}
        title="Profile"
        description="Your account details."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile picture</CardTitle>
            <CardDescription>Your avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account info</CardTitle>
            <CardDescription>Name, email and user ID</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  ID
                </dt>
                <dd className="mt-1 text-sm font-mono text-foreground">
                  {user.id ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Name
                </dt>
                <dd className="mt-1 text-foreground">{user.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </dt>
                <dd className="mt-1 text-foreground">{user.email ?? '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
