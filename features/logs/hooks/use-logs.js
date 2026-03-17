"use client";

import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/lib/api";

export function useLogs(params = {}) {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: async () => {
      const res = await logsApi.list(params);
      const data = res?.data ?? res;
      const list = data?.items ?? data?.logs ?? data ?? [];
      return {
        items: Array.isArray(list) ? list : [],
        total: data?.total ?? 0,
        page: data?.page ?? 1,
        limit: data?.limit ?? 50,
      };
    },
  });
}
