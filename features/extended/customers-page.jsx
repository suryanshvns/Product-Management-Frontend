"use client";

import { Contact } from "lucide-react";
import { customersApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function CustomersPage() {
  return (
    <EntityListPage
      title="Customers"
      description="B2B contacts and companies."
      icon={Contact}
      queryKey={["customers", { page: 1, limit: 30 }]}
      queryFn={() => customersApi.list({ page: 1, limit: 30 })}
      columns={[
        { name: "Name", selector: (r) => r.contactName ?? r.name ?? "—" },
        { name: "Company", selector: (r) => r.companyName ?? "—" },
        { name: "Email", selector: (r) => r.email ?? "—", wrap: true },
        { name: "Phone", selector: (r) => r.phone ?? "—", width: "120px" },
      ]}
    />
  );
}
