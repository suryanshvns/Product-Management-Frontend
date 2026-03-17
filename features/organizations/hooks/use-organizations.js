"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/lib/api";

export function useOrganizations(params = {}) {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: async () => {
      const res = await organizationsApi.list(params);
      const data = res?.data ?? res;
      const list = data?.organizations ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => organizationsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
