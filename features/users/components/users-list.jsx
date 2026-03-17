'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { ROUTES, ROLE_NAMES } from '@/utils/constants';
import { usersApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
const DEBOUNCE_MS = 300;

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async (pageNum, limitNum, searchTerm) => {
    setLoading(true);
    setError(false);
    try {
      const res = await usersApi.list({
        page: pageNum,
        limit: limitNum,
        search: searchTerm || undefined,
      });
      const data = res?.data ?? res;
      const list = data?.users ?? [];
      const pagination = data?.pagination ?? {};
      setUsers(Array.isArray(list) ? list : []);
      setTotalRows(pagination?.total ?? 0);
    } catch {
      setError(true);
      setUsers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search: sync searchInput -> search, reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers(page, limit, search);
  }, [page, limit, search, fetchUsers]);

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  const roleNames = row => {
    if (!row.roles || !Array.isArray(row.roles)) return '—';
    return row.roles
      .map(r => (typeof r === 'object' && r?.name ? r.name : r))
      .join(', ');
  };

  const filteredByRole = roleFilter
    ? users.filter(u => Array.isArray(u.roles) && u.roles.includes(roleFilter))
    : users;

  const columns = [
    {
      name: 'Name',
      selector: row => row.name ?? '—',
      sortable: false,
      style: { paddingLeft: '1rem', textAlign: 'left' },
    },
    { name: 'Email', selector: row => row.email ?? '—', sortable: false },
    {
      name: 'Roles',
      cell: row => roleNames(row),
      sortable: false,
    },
    {
      name: 'lastLoginAt',
      cell: row => formatDate(row.lastLoginAt) ?? '—',
      sortable: false,
    },
    {
      name: 'Actions',
      cell: row => (
        <Link href={ROUTES.USER_EDIT(row.id)}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      ),
      sortable: false,
      right: true,
      style: { paddingRight: '1rem', textAlign: 'right' },
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={Users}
          title="Users"
          description="Manage users (superadmin/admin)."
        />
        <ErrorState onRetry={() => fetchUsers(page, limit, search)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Users"
        description="Manage users. List, search, filter by role, and paginate."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All users</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="search"
              placeholder="Search by email or name..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              {ROLE_NAMES.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(1, limit, searchInput || search)}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            key={search}
            columns={columns}
            data={filteredByRole}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={1}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[10, 20, 50]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            noDataComponent="No users found."
            customStyles={{
              headRow: { style: { backgroundColor: 'hsl(var(--muted))' } },
              headCells: {
                style: { paddingLeft: '1rem', paddingRight: '1rem' },
              },
              cells: {
                style: { paddingLeft: '1rem', paddingRight: '1rem' },
              },
              table: {
                style: { width: '100%' },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
