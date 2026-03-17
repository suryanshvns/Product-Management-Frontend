"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const res = await analyticsApi.overview();
      const data = res?.data ?? res;
      return {
        productCount: data?.productCount ?? 0,
        categoryCount: data?.categoryCount ?? 0,
        lowStockCount: data?.lowStockCount ?? 0,
      };
    },
  });
}

export function useAnalyticsProductsByCategory() {
  return useQuery({
    queryKey: ["analytics", "products-by-category"],
    queryFn: async () => {
      const res = await analyticsApi.productsByCategory();
      const data = res?.data ?? res;
      const list = data?.categories ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useAnalyticsTopProducts(limit = 10) {
  return useQuery({
    queryKey: ["analytics", "top-products", limit],
    queryFn: async () => {
      const res = await analyticsApi.topProducts({ limit });
      const data = res?.data ?? res;
      const list = data?.products ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useAnalyticsInventoryStatus() {
  return useQuery({
    queryKey: ["analytics", "inventory-status"],
    queryFn: async () => {
      const res = await analyticsApi.inventoryStatus();
      const data = res?.data ?? res;
      return {
        total: data?.total ?? 0,
        lowStock: data?.lowStock ?? 0,
        inStock: data?.inStock ?? 0,
        lowStockItems: Array.isArray(data?.lowStockItems) ? data.lowStockItems : [],
        summary: data?.summary ?? {},
      };
    },
  });
}
