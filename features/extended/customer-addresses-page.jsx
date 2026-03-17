"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import DataTable from "react-data-table-component";
import { customerAddressesApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { normalizeList } from "@/components/shared/entity-list-page";

export function CustomerAddressesPage() {
  const [customerId, setCustomerId] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["customer-addresses", submitted],
    queryFn: () => customerAddressesApi.listByCustomer(submitted),
    enabled: !!submitted?.trim(),
  });

  const list = normalizeList(data);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MapPin}
        title="Customer addresses"
        description="Shipping and billing addresses per customer."
      />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[240px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Customer ID</label>
          <Input
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Customer ID"
          />
        </div>
        <Button onClick={() => setSubmitted(customerId.trim())}>Load addresses</Button>
      </div>
      {!submitted ? (
        <EmptyState icon={MapPin} title="Enter customer ID" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading && !list.length ? (
        <div className="p-6">
          <TableSkeleton rows={5} cols={3} />
        </div>
      ) : !list.length ? (
        <EmptyState icon={MapPin} title="No addresses" />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <DataTable
            columns={[
              { name: "Line 1", selector: (r) => r.line1 ?? r.addressLine1 ?? "—", wrap: true },
              { name: "City", selector: (r) => r.city ?? "—" },
              { name: "Default", selector: (r) => (r.isDefault ? "Yes" : "—"), width: "80px" },
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
