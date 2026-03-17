"use client";

import { ListOrdered } from "lucide-react";
import { priceListsApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function PriceListsPage() {
  return (
    <EntityListPage
      title="Price lists"
      description="Group-specific and variant pricing."
      icon={ListOrdered}
      queryKey={["price-lists"]}
      queryFn={() => priceListsApi.list()}
      columns={[
        { name: "Name", selector: (r) => r.name ?? "—" },
        { name: "Group", selector: (r) => r.customerGroupId ?? "—", width: "140px" },
        { name: "Default", selector: (r) => (r.isDefault ? "Yes" : "—"), width: "80px" },
      ]}
    />
  );
}
