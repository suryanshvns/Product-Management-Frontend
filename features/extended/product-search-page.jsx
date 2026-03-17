"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import DataTable from "react-data-table-component";
import { searchApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";

export function ProductSearchPage() {
  const [q, setQ] = useState("");
  const [sku, setSku] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [params, setParams] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["search-products", params],
    queryFn: () => searchApi.products({ ...params, page: 1, limit: 30 }),
    enabled: !!params,
  });

  const list = normalizeList(data);

  const runSearch = () => {
    const p = {};
    if (q.trim()) p.q = q.trim();
    if (sku.trim()) p.sku = sku.trim();
    if (tagSlug.trim()) p.tagSlug = tagSlug.trim();
    if (!Object.keys(p).length) return;
    setParams(p);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="Product search"
        description="Search by keyword, SKU, or tag slug."
      />
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Query</label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. wireless" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">SKU</label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-00001" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Tag slug</label>
          <Input value={tagSlug} onChange={(e) => setTagSlug(e.target.value)} placeholder="sale" />
        </div>
        <div className="flex items-end">
          <Button className="w-full" onClick={runSearch}>
            Search
          </Button>
        </div>
      </div>
      {!params ? (
        <EmptyState icon={Search} title="Run a search" description="Enter query, SKU, or tag." />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={8} cols={4} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Search} title="No results" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Name", selector: (r) => r.name ?? "—", wrap: true },
              { name: "SKU", selector: (r) => r.sku ?? "—" },
              { name: "Price", selector: (r) => (r.price != null ? String(r.price) : "—"), width: "90px" },
              { name: "Status", selector: (r) => r.status ?? "—", width: "100px" },
            ]}
            data={list}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 400px)"
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
