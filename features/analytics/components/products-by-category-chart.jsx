'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/shared/skeleton';
import { useAnalyticsProductsByCategory } from '../hooks/use-analytics';

const CHART_COLORS = { primary: '#8B5CF6' };

export function ProductsByCategoryChart() {
  const { data: rawData, isLoading } = useAnalyticsProductsByCategory();

  const chartData = (Array.isArray(rawData) ? rawData : []).map((cat) => ({
    name: cat.name ?? cat.categoryName ?? 'Uncategorized',
    count: cat.productCount ?? cat.products?.length ?? cat.count ?? 0,
  }));

  if (isLoading) {
    return (
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle>Products by category</CardTitle>
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
        <CardTitle className="text-base font-semibold">
          Products by category
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Product count per category
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                }}
              />
              <Bar
                dataKey="count"
                fill={CHART_COLORS.primary}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
