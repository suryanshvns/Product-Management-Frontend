"use client";

import { Ticket } from "lucide-react";
import { couponsApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function CouponsPage() {
  return (
    <EntityListPage
      title="Coupons"
      description="Discount codes and validation rules."
      icon={Ticket}
      queryKey={["coupons", { page: 1, limit: 30 }]}
      queryFn={() => couponsApi.list({ page: 1, limit: 30 })}
      columns={[
        { name: "Code", selector: (r) => r.code ?? "—" },
        { name: "Type", selector: (r) => r.discountType ?? "—", width: "100px" },
        { name: "Value", selector: (r) => (r.value != null ? String(r.value) : "—"), width: "80px" },
        { name: "Active", selector: (r) => (r.isActive ? "Yes" : "No"), width: "80px" },
        { name: "Max uses", selector: (r) => r.maxUses ?? "—", width: "90px" },
      ]}
    />
  );
}
