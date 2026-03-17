import { cn } from "@/lib/utils";

/**
 * Consistent page header with optional icon, title, and description.
 * Use for every main screen to keep the app scannable and user-friendly.
 */
export function PageHeader({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary-subtle text-primary"
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
