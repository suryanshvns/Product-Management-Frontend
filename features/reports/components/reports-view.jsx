"use client";

import { useState } from "react";
import { FileText, BarChart3, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useSalesReport, useInventoryReport } from "../hooks/use-reports";

function SalesReportTable({ data }) {
  const rows = data?.sales ?? data?.items ?? (Array.isArray(data) ? data : []);
  if (!rows.length) return <p className="text-sm text-muted-foreground">No sales data.</p>;
  const keys = Object.keys(rows[0] ?? {});
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {keys.map((k) => (
              <th key={k} className="px-4 py-2 text-left font-medium">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((row, i) => (
            <tr key={i} className="border-b">
              {keys.map((k) => (
                <td key={k} className="px-4 py-2">
                  {typeof row[k] === "object" ? JSON.stringify(row[k]) : String(row[k] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && <p className="mt-2 text-xs text-muted-foreground">Showing first 50 rows.</p>}
    </div>
  );
}

function InventoryReportTable({ data }) {
  const rows = data?.inventory ?? data?.items ?? (Array.isArray(data) ? data : []);
  if (!rows.length) return <p className="text-sm text-muted-foreground">No inventory report data.</p>;
  const keys = Object.keys(rows[0] ?? {});
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {keys.map((k) => (
              <th key={k} className="px-4 py-2 text-left font-medium">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((row, i) => (
            <tr key={i} className="border-b">
              {keys.map((k) => (
                <td key={k} className="px-4 py-2">
                  {typeof row[k] === "object" ? JSON.stringify(row[k]) : String(row[k] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && <p className="mt-2 text-xs text-muted-foreground">Showing first 50 rows.</p>}
    </div>
  );
}

export function ReportsView() {
  const [activeTab, setActiveTab] = useState("sales");

  const { data: salesData, isLoading: salesLoading, isError: salesError, refetch: refetchSales } = useSalesReport();
  const { data: inventoryData, isLoading: invLoading, isError: invError, refetch: refetchInv } = useInventoryReport();

  const isSales = activeTab === "sales";
  const isLoading = isSales ? salesLoading : invLoading;
  const isError = isSales ? salesError : invError;
  const refetch = isSales ? refetchSales : refetchInv;

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader icon={FileText} title="Reports" description="Sales and inventory reports." />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} title="Reports" description="Sales and inventory reports." />

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "sales"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Sales
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "inventory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          Inventory
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{activeTab === "sales" ? "Sales report" : "Inventory report"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={6} cols={4} />
          ) : activeTab === "sales" ? (
            <SalesReportTable data={salesData} />
          ) : (
            <InventoryReportTable data={inventoryData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
