"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DataTable({
  columns,
  data,
  keyExtractor = (row) => row.id,
  onSort,
  sortKey,
  sortDirection,
  className,
  emptyMessage = "No data found.",
  isLoading,
}) {
  const handleSort = (key) => {
    if (!onSort || !key) return;
    const next = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, next);
  };

  return (
    <div
      className={cn(
        "overflow-auto rounded-xl border border-border bg-card",
        className
      )}
    >
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                  col.className,
                  col.sortable && "cursor-pointer select-none hover:text-foreground"
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-primary">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                <div className="flex justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              </td>
            </tr>
          ) : !data?.length ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border/80 transition-colors hover:bg-accent/50 last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("p-4 align-middle", col.cellClassName)}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
