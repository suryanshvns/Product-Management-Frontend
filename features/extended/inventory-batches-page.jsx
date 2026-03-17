"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Boxes } from "lucide-react";
import DataTable from "react-data-table-component";
import { inventoryBatchesApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";
import { formatDate } from "@/lib/utils";

export function InventoryBatchesPage() {
  const [variantId, setVariantId] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory-batches", submitted],
    queryFn: () =>
      inventoryBatchesApi.list({
        productVariantId: submitted,
        page: 1,
        limit: 50,
      }),
    enabled: !!submitted?.trim(),
  });

  const list = normalizeList(data);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Boxes}
        title="Inventory batches"
        description="Lots, expiry, and quantities by variant."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[240px] flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Product variant ID
          </label>
          <Input
            placeholder="Variant ID"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          />
        </div>
        <Button onClick={() => setSubmitted(variantId.trim())}>Load batches</Button>
      </div>
      {!submitted ? (
        <EmptyState icon={Boxes} title="Enter variant ID" description="Batches are per variant." />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={6} cols={4} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Boxes} title="No batches" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Batch", selector: (r) => r.batchNumber ?? r.batch ?? "—" },
              { name: "Qty", selector: (r) => r.quantity ?? "—", width: "80px" },
              {
                name: "Expiry",
                selector: (r) =>
                  r.expiryDate ? formatDate(r.expiryDate) : "—",
                width: "140px",
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
