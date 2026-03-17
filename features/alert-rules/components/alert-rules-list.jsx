"use client";

import DataTable from "react-data-table-component";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useAlertRules } from "../hooks/use-alert-rules";

export function AlertRulesList() {
  const { data: rules, isLoading, isError, refetch } = useAlertRules();
  const list = Array.isArray(rules) ? rules : [];

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={AlertTriangle} title="Alert rules" description="Manage alert rules." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    { name: "ID", selector: (row) => row.id ?? "—", sortable: false, width: "80px", style: { paddingLeft: "1rem" } },
    { name: "Name", selector: (row) => row.name ?? row.title ?? "—", sortable: false },
    { name: "Condition", selector: (row) => row.condition ?? row.threshold ?? "—", sortable: false },
    { name: "Enabled", selector: (row) => (row.enabled != null ? (row.enabled ? "Yes" : "No") : "—"), sortable: false, width: "80px" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={AlertTriangle} title="Alert rules" description="Manage alert rules." />

      <div className="rounded-xl border border-border bg-card">
        {isLoading && !list.length ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={4} />
          </div>
        ) : !list.length ? (
          <EmptyState icon={AlertTriangle} title="No alert rules" description="Alert rules will appear here." />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            progressPending={isLoading}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            noDataComponent="No alert rules found."
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
