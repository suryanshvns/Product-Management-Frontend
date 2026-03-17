"use client";

import { UsersRound } from "lucide-react";
import { customerGroupsApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function CustomerGroupsPage() {
  return (
    <EntityListPage
      title="Customer groups"
      description="Wholesale, VIP, and other segments."
      icon={UsersRound}
      queryKey={["customer-groups"]}
      queryFn={() => customerGroupsApi.list()}
      columns={[
        { name: "Name", selector: (r) => r.name ?? "—" },
        { name: "Slug", selector: (r) => r.slug ?? "—" },
      ]}
    />
  );
}
