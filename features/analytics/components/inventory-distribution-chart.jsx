'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/shared/skeleton';
import { useAnalyticsInventoryStatus } from '../hooks/use-analytics';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

export function InventoryDistributionChart() {
  const { data, isLoading } = useAnalyticsInventoryStatus();

  const inStock = data?.inStock ?? 0;
  const lowStock = data?.lowStock ?? 0;
  const chartData = [
    { name: 'In stock', value: inStock },
    { name: 'Low stock', value: lowStock },
  ].filter((d) => d.value > 0);

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Inventory distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Inventory distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Stock levels across your catalog
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No inventory data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Inventory distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Stock levels across your catalog
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                }}
              />
              <Legend
                wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }}
                fontSize={12}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
