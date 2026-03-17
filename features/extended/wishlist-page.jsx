"use client";

import { Heart } from "lucide-react";
import { wishlistApi } from "@/lib/api";
import { EntityListPage } from "@/components/shared/entity-list-page";

export function WishlistPage() {
  return (
    <EntityListPage
      title="Wishlist"
      description="Saved products for the current user."
      icon={Heart}
      queryKey={["wishlist", { page: 1, limit: 30 }]}
      queryFn={() => wishlistApi.list({ page: 1, limit: 30 })}
      columns={[
        { name: "Product ID", selector: (r) => r.productId ?? r.id ?? "—" },
        { name: "Name", selector: (r) => r.product?.name ?? r.name ?? "—", wrap: true },
      ]}
    />
  );
}
