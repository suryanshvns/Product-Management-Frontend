'use client';

import {
  Package,
  FolderTree,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardShimmer } from '@/components/shared/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatNumber } from '@/lib/utils';
import { useAnalyticsOverview } from '../hooks/use-analytics';
import { ProductsByCategoryChart } from './products-by-category-chart';
import { InventoryDistributionChart } from './inventory-distribution-chart';
import { ProductStatusChart } from './product-status-chart';

const statCards = [
  {
    title: 'Total Products',
    key: 'productCount',
    icon: Package,
    value: 0,
    trend: 20,
    trendUp: true,
    iconBg: 'bg-[#8B5CF6]/15',
    iconColor: 'text-[#8B5CF6]',
  },
  {
    title: 'Categories',
    key: 'categoryCount',
    icon: FolderTree,
    value: 0,
    trend: 8,
    trendUp: true,
    iconBg: 'bg-[#3B82F6]/15',
    iconColor: 'text-[#3B82F6]',
  },
  {
    title: 'Low Stock Items',
    key: 'lowStockCount',
    icon: AlertTriangle,
    value: 0,
    trend: 32,
    trendUp: true,
    iconBg: 'bg-[#0EA5E9]/15',
    iconColor: 'text-[#0EA5E9]',
  },
  {
    title: 'Active Listings',
    key: 'active',
    icon: TrendingUp,
    value: 0,
    trend: 3,
    trendUp: false,
    iconBg: 'bg-[#10B981]/15',
    iconColor: 'text-[#10B981]',
  },
];

export function DashboardView() {
  const { data, isLoading, isError, refetch } = useAnalyticsOverview();

  if (isLoading) return <DashboardShimmer />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const stats = {
    productCount: data?.productCount ?? 0,
    categoryCount: data?.categoryCount ?? 0,
    lowStockCount: data?.lowStockCount ?? 0,
    active: 0,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Dashboard Overview
      </h1>

      {/* KPI cards – white, rounded, icon + value + trend */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => {
          const Icon = card.icon;
          const value = stats[card.key] ?? card.value;
          const trend = card.trend;
          const trendUp = card.trendUp;
          return (
            <Card
              key={card.key}
              className="border-border bg-card shadow-card hover:shadow-elevated transition-shadow"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {formatNumber(value)}
                </p>
                <p
                  className={`mt-1.5 flex items-center gap-0.5 text-xs font-medium ${
                    trendUp ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {trendUp ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {trend}% than last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductsByCategoryChart />
        <InventoryDistributionChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <ProductStatusChart />
      </div>
    </div>
  );
}
