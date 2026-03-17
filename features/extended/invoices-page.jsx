"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import DataTable from "react-data-table-component";
import { invoicesApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";
import { formatDate } from "@/lib/utils";

export function InvoicesPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const list = normalizeList(data);

  const [orderId, setOrderId] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const generate = async () => {
    if (!orderId.trim()) return;
    setGenLoading(true);
    try {
      await invoicesApi.generate({ orderId: orderId.trim() });
      setOrderId("");
      refetch();
    } catch {
      /* toast optional */
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Receipt}
        title="Invoices"
        description="Generate from orders and view invoice list."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Order ID (generate)</label>
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
          />
        </div>
        <Button onClick={generate} disabled={genLoading || !orderId.trim()}>
          {genLoading ? "Generating…" : "Generate invoice"}
        </Button>
      </div>
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={8} cols={4} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={Receipt} title="No invoices" description="Generate from an order." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Number", selector: (r) => r.invoiceNumber ?? r.number ?? r.id ?? "—" },
              { name: "Order", selector: (r) => r.orderId ?? "—" },
              {
                name: "Date",
                selector: (r) =>
                  r.createdAt ? formatDate(r.createdAt) : "—",
                width: "160px",
              },
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
