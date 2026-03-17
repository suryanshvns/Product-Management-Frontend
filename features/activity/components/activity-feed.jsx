"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, FileEdit, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShimmer } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";

const actionIcons = {
  create: Plus,
  update: FileEdit,
  delete: Trash2,
  view: Activity,
};

const actionLabels = {
  create: "created",
  update: "updated",
  delete: "deleted",
  view: "viewed",
};

export function ActivityFeed() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["activity"],
    queryFn: () => Promise.resolve([]),
  });

  const logs = data?.data ?? data ?? [];

  if (isLoading) return <PageShimmer />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Activity}
        title="Activity Logs"
        description="Recent admin actions across the platform."
      />

      {!logs.length ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Actions you take will appear here."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Timestamp and user responsible for each action
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = actionIcons[log.action] || Activity;
                const label = actionLabels[log.action] || log.action;
                return (
                  <li
                    key={log.id}
                    className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{log.userName ?? "System"}</span>
                        {" "}{label}{" "}
                        <span className="font-medium">{log.entity ?? "item"}</span>
                        {log.details && (
                          <span className="text-muted-foreground"> — {log.details}</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
