"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link2 } from "lucide-react";
import DataTable from "react-data-table-component";
import { relatedProductsApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";

export function RelatedProductsPage() {
  const [productId, setProductId] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [relationType, setRelationType] = useState("related");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["related-products", submitted, relationType],
    queryFn: () =>
      relatedProductsApi.list(submitted, { relationType }),
    enabled: !!submitted?.trim(),
  });

  const list = normalizeList(data);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Link2}
        title="Related products"
        description="Cross-sell and related items for a product."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Product ID</label>
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Product ID"
          />
        </div>
        <div className="w-[160px]">
          <label className="mb-1 block text-xs text-muted-foreground">Relation</label>
          <Select value={relationType} onValueChange={setRelationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="related">Related</SelectItem>
              <SelectItem value="upsell">Upsell</SelectItem>
              <SelectItem value="cross_sell">Cross-sell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setSubmitted(productId.trim())}>Load</Button>
      </div>
      {!submitted ? (
        <EmptyState icon={Link2} title="Enter product ID" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={5} cols={3} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Link2} title="No related products" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Related ID", selector: (r) => r.relatedProductId ?? r.id ?? "—" },
              { name: "Type", selector: (r) => r.relationType ?? relationType },
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
