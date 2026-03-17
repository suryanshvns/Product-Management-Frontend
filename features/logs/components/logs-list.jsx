"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import { ScrollText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useLogs } from "../hooks/use-logs";
import { formatDate } from "@/lib/utils";

const actionVariant = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  status_change: "outline",
  stock_update: "outline",
};

function formatValues(obj) {
  if (obj == null || typeof obj !== "object") return "—";
  const entries = Object.entries(obj).filter(([, v]) => v != null && v !== "");
  if (!entries.length) return "—";
  return entries.map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`).join(", ");
}

export function LogsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isError, refetch } = useLogs({ page, limit });
  const items = data?.items ?? [];
  const totalRows = data?.total ?? 0;

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={ScrollText} title="Activity logs" description="Audit trail of changes." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const columns = [
    {
      name: "Action",
      cell: (row) => {
        const action = (row.action ?? "").replace(/_/g, " ");
        return (
          <Badge variant={actionVariant[row.action] || "secondary"} className="capitalize">
            {action || "—"}
          </Badge>
        );
      },
      sortable: false,
      width: "120px",
      style: { paddingLeft: "1rem" },
    },
    {
      name: "Entity",
      cell: (row) => (
        <span className="capitalize text-foreground">{row.entity ?? "—"}</span>
      ),
      sortable: false,
      width: "100px",
    },
    {
      name: "Summary",
      cell: (row) => (
        <span className="text-sm text-foreground" title={row.changeSummary}>
          {row.changeSummary ?? "—"}
        </span>
      ),
      sortable: false,
      wrap: true,
      minWidth: "220px",
    },
    {
      name: "Changed by",
      cell: (row) => {
        const by = row.changedBy;
        if (!by) return "—";
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span title={by.email}>{by.name ?? by.email ?? "—"}</span>
            {by.designation && (
              <span className="text-xs text-muted-foreground">({by.designation})</span>
            )}
          </div>
        );
      },
      sortable: false,
      width: "180px",
    },
    {
      name: "Date",
      cell: (row) => {
        const d = row.createdAt ?? row.created_at;
        return d ? formatDate(d) : "—";
      },
      sortable: false,
      width: "160px",
    },
  ];

  const expandableRows = !!items.some((r) => r.oldValues != null || r.newValues != null);
  const ExpandedComponent = ({ data: row }) => (
    <div className="border-t border-border bg-muted/30 px-4 py-3 text-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        {row.oldValues != null && Object.keys(row.oldValues).length > 0 && (
          <div>
            <p className="mb-1 font-medium text-muted-foreground">Previous</p>
            <pre className="max-h-32 overflow-auto rounded-md border border-border bg-background p-2 text-xs">
              {formatValues(row.oldValues)}
            </pre>
          </div>
        )}
        {row.newValues != null && Object.keys(row.newValues).length > 0 && (
          <div>
            <p className="mb-1 font-medium text-muted-foreground">New</p>
            <pre className="max-h-32 overflow-auto rounded-md border border-border bg-background p-2 text-xs">
              {formatValues(row.newValues)}
            </pre>
          </div>
        )}
      </div>
      {row.metadata && (row.metadata.ip || row.metadata.userAgent) && (
        <p className="mt-2 text-xs text-muted-foreground">
          {row.metadata.ip && `IP: ${row.metadata.ip}`}
          {row.metadata.ip && row.metadata.userAgent && " · "}
          {row.metadata.userAgent && `UA: ${row.metadata.userAgent}`}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ScrollText}
        title="Activity logs"
        description="Audit trail of product, category, and inventory changes."
      />

      <div className="rounded-2xl border border-border bg-card shadow-card">
        {isLoading && !items.length ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={5} />
          </div>
        ) : !items.length ? (
          <EmptyState icon={ScrollText} title="No logs" description="Activity will appear here." />
        ) : (
          <DataTable
            columns={columns}
            data={items}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={1}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[10, 20, 50]}
            onChangePage={setPage}
            onChangeRowsPerPage={(newLimit, newPage) => {
              setLimit(newLimit);
              setPage(newPage);
            }}
            expandableRows={expandableRows}
            expandableRowsComponent={ExpandedComponent}
            expandableRowDisabled={(row) => row.oldValues == null && row.newValues == null}
            noDataComponent="No logs found."
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 240px)"
            customStyles={{
              headRow: { style: { backgroundColor: "hsl(var(--muted))" } },
              headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
              cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
              table: { style: { width: "100%" } },
            }}
          />
        )}
      </div>
    </div>
  );
}
