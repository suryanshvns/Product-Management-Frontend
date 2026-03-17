"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";

export function useCategories(params = {}) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const res = await categoriesApi.list(params);
      const data = res?.data ?? res;
      const list = data?.categories ?? data?.items ?? data;
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useCategory(id, options = {}) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await categoriesApi.getById(id);
      return res?.data ?? res;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => categoriesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => categoriesApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
