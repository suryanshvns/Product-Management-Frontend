"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/shared/skeleton";
import { useProducts } from "@/features/products/hooks/use-products";

export function ProductStatusChart() {
  const { data, isLoading } = useProducts({ limit: 500 });
  const products = data?.data ?? [];

  const statusCounts = products.reduce((acc, p) => {
    const s = (p.status ?? "draft").toLowerCase();
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const chartData = ["draft", "active", "archived"].map((status) => ({
    status,
    count: statusCounts[status] ?? 0,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product status</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Product status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Count of products by status
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="status"
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[0, 6, 6, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
