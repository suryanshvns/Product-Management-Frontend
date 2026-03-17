'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/shared/page-header';
import { PageShimmer } from '@/components/shared/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/utils/constants';
import { usersApi, rolesApi } from '@/lib/api';

export function UserEdit({ userId }) {
  const router = useRouter();
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const canManageRoles = hasRole('superadmin') || hasRole('admin');
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [roleAction, setRoleAction] = useState(null); // { roleId, action: 'assign'|'revoke' }

  const fetchUser = async () => {
    try {
      const res = await usersApi.getById(userId);
      const u = res?.data ?? res;
      if (u) {
        setUser(u);
        setName(u.name ?? '');
      }
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          usersApi.getById(userId),
          canManageRoles ? rolesApi.list() : Promise.resolve(null),
        ]);
        const u = userRes?.data ?? userRes;
        if (!cancelled && u) {
          setUser(u);
          setName(u.name ?? '');
        }
        if (!cancelled && rolesRes) {
          const list = rolesRes?.data ?? rolesRes?.roles ?? rolesRes;
          setRoles(Array.isArray(list) ? list : []);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, canManageRoles]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.update(userId, { name: name.trim() || undefined });
      toast({ title: 'User updated' });
      router.push(ROUTES.USERS);
    } catch (err) {
      toast({ title: 'Update failed', description: err?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const userRoleIds = Array.isArray(user?.roles)
    ? user.roles.map((r) => (typeof r === 'object' && r?.id ? r.id : r))
    : [];
  const userRoleNames = Array.isArray(user?.roles)
    ? user.roles.map((r) => (typeof r === 'object' && r?.name ? r.name : r))
    : [];

  const handleRoleAssign = async (roleId) => {
    setRoleAction({ roleId, action: 'assign' });
    try {
      await rolesApi.assign(userId, roleId);
      toast({ title: 'Role assigned' });
      await fetchUser();
    } catch (err) {
      toast({ title: 'Assign failed', description: err?.message, variant: 'destructive' });
    } finally {
      setRoleAction(null);
    }
  };

  const handleRoleRevoke = async (roleId) => {
    setRoleAction({ roleId, action: 'revoke' });
    try {
      await rolesApi.revoke(userId, roleId);
      toast({ title: 'Role revoked' });
      await fetchUser();
    } catch (err) {
      toast({ title: 'Revoke failed', description: err?.message, variant: 'destructive' });
    } finally {
      setRoleAction(null);
    }
  };

  const hasRoleForUser = (role) => {
    const id = typeof role === 'object' ? role?.id ?? role?.name : role;
    const name = typeof role === 'object' ? role?.name : role;
    return userRoleIds.includes(id) || userRoleNames.includes(name);
  };

  if (loading) return <PageShimmer />;
  if (error || !user) {
    return (
      <div className="space-y-6">
        <PageHeader icon={User} title="Edit user" description="Update user details." />
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-muted-foreground">
        <Link href={ROUTES.USERS}>
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit user</CardTitle>
          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
          <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
              />
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </form>
        </CardContent>
      </Card>

      {canManageRoles && roles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
            <p className="text-sm text-muted-foreground">Assign or revoke roles for this user.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roles.map((role) => {
                const id = typeof role === 'object' ? role?.id ?? role?.name : role;
                const name = typeof role === 'object' ? role?.name : role;
                const has = hasRoleForUser(role);
                const busy = roleAction?.roleId === id;
                return (
                  <li key={id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="font-medium">{name ?? id}</span>
                    {has ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleRevoke(id)}
                        disabled={busy}
                      >
                        {busy && roleAction?.action === 'revoke' ? 'Revoking...' : 'Revoke'}
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRoleAssign(id)}
                        disabled={busy}
                      >
                        {busy && roleAction?.action === 'assign' ? 'Assigning...' : 'Assign'}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
