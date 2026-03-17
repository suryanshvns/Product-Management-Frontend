"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const pathLabels = {
  dashboard: "Dashboard",
  products: "Products",
  new: "New Product",
  categories: "Categories",
  inventory: "Inventory",
  analytics: "Analytics",
  tags: "Tags",
  "product-variants": "Variants",
  "inventory-batches": "Batches",
  "related-products": "Related",
  search: "Search",
  coupons: "Coupons",
  invoices: "Invoices",
  customers: "Customers",
  "customer-groups": "Customer groups",
  "customer-addresses": "Addresses",
  quotes: "Quotes",
  reviews: "Reviews",
  wishlist: "Wishlist",
  "price-lists": "Price lists",
  orders: "Orders",
  profile: "Profile",
  settings: "Settings",
  users: "Users",
  logs: "Logs",
  notifications: "Notifications",
};

export function Breadcrumb({ className }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label =
      pathLabels[segment] ||
      (segment.match(/^[a-f0-9-]{36}$/i) ? "Edit" : segment);
    return { href, label, isLast: i === segments.length - 1, isHome: i === 0 && segment === "dashboard" };
  });

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {i > 0 && (
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground/70"
              aria-hidden
            />
          )}
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {item.isHome ? (
                <Home className="h-4 w-4 shrink-0" aria-hidden />
              ) : null}
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
