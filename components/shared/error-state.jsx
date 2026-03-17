import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * User-friendly error state with retry action.
 */
export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-12 text-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10"
        aria-hidden
      >
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-6 gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
