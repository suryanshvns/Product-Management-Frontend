"use client";

import DataTable from "react-data-table-component";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useLogs } from "../hooks/use-logs";
import { formatDate } from "@/lib/utils";

export function LogsList() {
  const { data: logs, isLoading, isError, refetch } = useLogs();
  const list = Array.isArray(logs) ? logs : [];

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={ScrollText} title="Logs" description="System and activity logs." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    { name: "ID", selector: (row) => row.id ?? "—", sortable: false, width: "80px", style: { paddingLeft: "1rem" } },
    { name: "Level", selector: (row) => row.level ?? row.severity ?? "—", sortable: false, width: "100px" },
    { name: "Message", selector: (row) => row.message ?? row.text ?? "—", sortable: false, wrap: true },
    {
      name: "Time",
      cell: (row) => formatDate(row.timestamp ?? row.createdAt ?? row.created_at) ?? "—",
      sortable: false,
      width: "160px",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={ScrollText} title="Logs" description="System and activity logs." />

      <div className="rounded-xl border border-border bg-card">
        {isLoading && !list.length ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={4} />
          </div>
        ) : !list.length ? (
          <EmptyState icon={ScrollText} title="No logs" description="Logs will appear here." />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            progressPending={isLoading}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            noDataComponent="No logs found."
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
