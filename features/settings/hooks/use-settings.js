"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, apiKeysApi, webhooksApi } from "@/lib/api";

export function useSettingsList(params = {}) {
  return useQuery({
    queryKey: ["settings", params],
    queryFn: async () => {
      const res = await settingsApi.list(params);
      const data = res?.data ?? res;
      const list = data?.settings ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : typeof data === "object" && !Array.isArray(data) ? [data] : [];
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => settingsApi.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useApiKeys(params = {}) {
  return useQuery({
    queryKey: ["api-keys", params],
    queryFn: async () => {
      const res = await apiKeysApi.list(params);
      const data = res?.data ?? res;
      const list = data?.apiKeys ?? data?.keys ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiKeysApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useWebhooks(params = {}) {
  return useQuery({
    queryKey: ["webhooks", params],
    queryFn: async () => {
      const res = await webhooksApi.list(params);
      const data = res?.data ?? res;
      const list = data?.webhooks ?? data?.items ?? data ?? [];
      return Array.isArray(list) ? list : [];
    },
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => webhooksApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}
