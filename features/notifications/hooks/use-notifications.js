"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const res = await notificationsApi.list(params);
      const data = res?.data ?? res;
      const list = data?.notifications ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}
