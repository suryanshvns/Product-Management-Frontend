"use client";

import { FileSpreadsheet } from "lucide-react";
import { quotesApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function QuotesPage() {
  return (
    <EntityListPage
      title="Quotes"
      description="Draft quotes and convert to orders."
      icon={FileSpreadsheet}
      queryKey={["quotes", { page: 1, limit: 30 }]}
      queryFn={() => quotesApi.list({ page: 1, limit: 30 })}
      columns={[
        { name: "ID", selector: (r) => r.id?.slice?.(0, 14) ?? "—", width: "120px" },
        { name: "Status", selector: (r) => r.status ?? "—", width: "100px" },
        { name: "Customer", selector: (r) => r.customerId ?? "—", width: "140px" },
        { name: "Valid until", selector: (r) => r.validUntil ?? "—" },
      ]}
    />
  );
}
