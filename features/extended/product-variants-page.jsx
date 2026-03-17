"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers, Package } from "lucide-react";
import DataTable from "react-data-table-component";
import { productVariantsApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";

export function ProductVariantsPage() {
  const [productId, setProductId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["product-variants", submittedId],
    queryFn: () =>
      productVariantsApi.list({
        productId: submittedId,
        page: 1,
        limit: 50,
      }),
    enabled: !!submittedId?.trim(),
  });

  const list = normalizeList(data);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Layers}
        title="Product variants"
        description="SKUs, attributes, and stock per variant. Enter a product ID to load variants."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[240px] flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Product ID
          </label>
          <Input
            placeholder="Paste product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>
        <Button onClick={() => setSubmittedId(productId.trim())}>Load variants</Button>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={!submittedId}
        >
          Refresh
        </Button>
      </div>
      {!submittedId ? (
        <EmptyState
          icon={Package}
          title="Enter a product ID"
          description="Variants are listed per product."
        />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="rounded-xl border border-border p-6">
          <TableSkeleton rows={6} cols={5} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Layers} title="No variants" description="No variants for this product." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "SKU", selector: (r) => r.sku ?? "—" },
              { name: "Name", selector: (r) => r.name ?? "—" },
              { name: "Qty", selector: (r) => r.quantity ?? "—", width: "80px" },
              { name: "Reorder", selector: (r) => r.reorderPoint ?? "—", width: "90px" },
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
