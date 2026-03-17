"use client";

import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";

export function normalizeList(res) {
  const d = res?.data ?? res;
  const list = d?.items ?? d?.data?.items ?? d?.results ?? d;
  return Array.isArray(list) ? list : [];
}

export function EntityListPage({
  title,
  description,
  icon: Icon,
  queryKey,
  queryFn,
  columns,
  headerAction,
  emptyTitle = "No data",
  emptyDescription = "Nothing to show yet.",
  scrollHeight = "calc(100vh - 280px)",
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn,
  });
  const list = normalizeList(data);

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={Icon} title={title} description={description} />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Icon}
        title={title}
        description={description}
        action={headerAction}
      />
      <div className="rounded-2xl border border-border bg-card shadow-card">
        {isLoading && !list.length ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={Math.min(columns.length, 5)} />
          </div>
        ) : !list.length ? (
          <EmptyState icon={Icon} title={emptyTitle} description={emptyDescription} />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            progressPending={isLoading}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            fixedHeader
            fixedHeaderScrollHeight={scrollHeight}
            noDataComponent="No rows."
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
