"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api";

export function useSalesReport(params = {}) {
  return useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: async () => {
      const res = await reportsApi.sales(params);
      return res?.data ?? res;
    },
  });
}

export function useInventoryReport(params = {}) {
  return useQuery({
    queryKey: ["reports", "inventory", params],
    queryFn: async () => {
      const res = await reportsApi.inventory(params);
      return res?.data ?? res;
    },
  });
}
