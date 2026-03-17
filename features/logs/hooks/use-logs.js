"use client";

import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/lib/api";

export function useLogs(params = {}) {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: async () => {
      const res = await logsApi.list(params);
      const data = res?.data ?? res;
      const list = data?.logs ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}
