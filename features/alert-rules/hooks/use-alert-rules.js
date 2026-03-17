"use client";

import { useQuery } from "@tanstack/react-query";
import { alertRulesApi } from "@/lib/api";

export function useAlertRules(params = {}) {
  return useQuery({
    queryKey: ["alert-rules", params],
    queryFn: async () => {
      const res = await alertRulesApi.list(params);
      const data = res?.data ?? res;
      const list = data?.alertRules ?? data?.rules ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}
