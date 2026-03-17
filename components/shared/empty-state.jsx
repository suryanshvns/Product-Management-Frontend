import { cn } from "@/lib/utils";

/**
 * Friendly empty state with icon, title, description, and optional action.
 * Designed to feel helpful and guide the user to the next step.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground"
          aria-hidden
        >
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
