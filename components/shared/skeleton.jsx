import { cn } from "@/lib/utils";

/** Base skeleton with shimmer effect (replaces pulse for loading states). */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("rounded-md bg-muted animate-shimmer", className)}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className="h-10 flex-1"
              style={{ flex: j === 0 ? 2 : 1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Skeleton className="mb-4 h-6 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <Skeleton className="mb-6 h-6 w-1/4" />
      <div className="flex h-[300px] items-end justify-between gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${60 + Math.random() * 40}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Full-page shimmer (replaces PageLoader) – generic layout. */
export function PageShimmer() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  );
}

/** Shimmer for dashboard/overview (hero + stat cards + chart placeholders). */
export function DashboardShimmer() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-muted p-8">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-2 h-5 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Skeleton className="mb-4 h-11 w-11 rounded-xl" />
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

/** Shimmer for category cards grid. */
export function CategoryGridShimmer({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
