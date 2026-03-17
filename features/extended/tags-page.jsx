"use client";

import { Tag } from "lucide-react";
import { tagsApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function TagsPage() {
  return (
    <EntityListPage
      title="Tags"
      description="Create and manage tags for products."
      icon={Tag}
      queryKey={["tags", { page: 1, limit: 50 }]}
      queryFn={() => tagsApi.list({ page: 1, limit: 50 })}
      columns={[
        { name: "ID", selector: (r) => r.id?.slice?.(0, 12) ?? "—", width: "110px" },
        { name: "Name", selector: (r) => r.name ?? "—" },
        { name: "Slug", selector: (r) => r.slug ?? "—" },
      ]}
    />
  );
}
