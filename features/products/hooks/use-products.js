"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, bulkApi } from "@/lib/api";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productsApi.list(params);
      const data = res?.data ?? res;
      return {
        data: data?.products ?? data?.items ?? data ?? [],
        total: data?.pagination?.total ?? data?.total ?? 0,
        pagination: data?.pagination,
      };
    },
  });
}

export function useProduct(id, options = {}) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productsApi.getById(id);
      return res?.data ?? res;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductStatus(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.updateStatus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

export function useUpdateProductStock(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.updateStock(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.bulkDelete(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useBulkUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsApi.bulkUpdateStatus(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useBulkImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkApi.importProducts(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUploadProductImages(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => productsApi.uploadImages(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useDeleteProductImage(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId) => productsApi.deleteImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}
