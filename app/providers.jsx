"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProviderWrapper } from "@/hooks/use-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/components/shared/confirm-dialog";

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConfirmProvider>
          <ToastProviderWrapper>{children}</ToastProviderWrapper>
        </ConfirmProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
