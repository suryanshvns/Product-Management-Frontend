"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";

export function useDashboardSummary(params = {}) {
  return useQuery({
    queryKey: ["dashboard", "summary", params],
    queryFn: async () => {
      const res = await dashboardApi.summary(params);
      return res?.data ?? res;
    },
  });
}
