"use client";

import DataTable from "react-data-table-component";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotifications } from "../hooks/use-notifications";
import { formatDate } from "@/lib/utils";

export function NotificationsList() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const list = Array.isArray(notifications) ? notifications : [];

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Bell} title="Notifications" description="View notifications." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    { name: "ID", selector: (row) => row.id ?? "—", sortable: false, width: "80px", style: { paddingLeft: "1rem" } },
    { name: "Title", selector: (row) => row.title ?? row.subject ?? "—", sortable: false },
    { name: "Message", selector: (row) => row.message ?? row.body ?? "—", sortable: false, wrap: true },
    {
      name: "Created",
      cell: (row) => formatDate(row.createdAt ?? row.created_at ?? row.timestamp) ?? "—",
      sortable: false,
      width: "160px",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={Bell} title="Notifications" description="View notifications." />

      <div className="rounded-xl border border-border bg-card">
        {isLoading && !list.length ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={4} />
          </div>
        ) : !list.length ? (
          <EmptyState icon={Bell} title="No notifications" description="Notifications will appear here." />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            progressPending={isLoading}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            noDataComponent="No notifications found."
            customStyles={{
              headRow: { style: { backgroundColor: "hsl(var(--muted))" } },
              headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
              cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
            }}
          />
        )}
      </div>
    </div>
  );
}
