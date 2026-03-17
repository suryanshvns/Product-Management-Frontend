"use client";

import { Star } from "lucide-react";
import { BRAND_NAME } from "@/utils/constants";
import { cn } from "@/lib/utils";

/**
 * Shared logo for sidebar, auth pages, and anywhere brand is shown.
 * variant: "sidebar" (dark bg), "auth" (light on dark), "light" (icon + text for light bg)
 */
export function BrandLogo({ variant = "light", className, showName = true, size = "md" }) {
  const isDark = variant === "sidebar" || variant === "auth";
  const sizeClasses = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl",
          sizeClasses,
          isDark ? "bg-white/20 text-white" : "bg-primary text-primary-foreground"
        )}
      >
        <Star className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
      </div>
      {showName && (
        <span
          className={cn(
            "font-bold tracking-tight",
            textSize,
            isDark ? "text-white" : "text-foreground"
          )}
        >
          {BRAND_NAME}
        </span>
      )}
    </div>
  );
}
