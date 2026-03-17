import { cn } from "@/lib/utils";
import { PageShimmer } from "@/components/shared/skeleton";

/** Legacy spinner (kept for minimal use cases). Prefer PageShimmer / Skeleton. */
export function Loader({ className, size = "default" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground",
        sizeClass,
        className
      )}
      aria-hidden
    />
  );
}

/** Full-page loading: now uses shimmer effect. Use PageShimmer from skeleton for direct import. */
export function PageLoader() {
  return <PageShimmer />;
}
