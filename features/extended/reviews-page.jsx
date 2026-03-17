"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import DataTable from "react-data-table-component";
import { reviewsApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";
import { formatDate } from "@/lib/utils";

export function ReviewsPage() {
  const [productId, setProductId] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reviews", submitted],
    queryFn: () => reviewsApi.listByProduct(submitted, { page: 1, limit: 30 }),
    enabled: !!submitted?.trim(),
  });

  const list = normalizeList(data);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Star}
        title="Reviews"
        description="Product ratings and comments."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[240px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Product ID</label>
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Product ID"
          />
        </div>
        <Button onClick={() => setSubmitted(productId.trim())}>Load reviews</Button>
      </div>
      {!submitted ? (
        <EmptyState icon={Star} title="Enter product ID" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={5} cols={3} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Star} title="No reviews" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Rating", selector: (r) => r.rating ?? "—", width: "80px" },
              { name: "Comment", selector: (r) => r.comment ?? "—", wrap: true },
              {
                name: "Date",
                selector: (r) => (r.createdAt ? formatDate(r.createdAt) : "—"),
                width: "150px",
              },
            ]}
            data={list}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 380px)"
            customStyles={{
              headRow: { style: { backgroundColor: "hsl(var(--muted))" } },
              headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
              cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
            }}
          />
        </div>
      )}
    </div>
  );
}
