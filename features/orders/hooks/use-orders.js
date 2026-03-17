"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";

export function useOrders(params = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const res = await ordersApi.list(params);
      const data = res?.data ?? res;
      const list = data?.orders ?? data?.items ?? data ?? [];
      return {
        data: Array.isArray(list) ? list : [],
        total: data?.pagination?.total ?? data?.total ?? 0,
        pagination: data?.pagination,
      };
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => ordersApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => ordersApi.updateStatus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
