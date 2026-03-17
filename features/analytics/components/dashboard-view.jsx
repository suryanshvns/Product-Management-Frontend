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
import { Button } from '@/components/ui/button';
import { DashboardShimmer } from '@/components/shared/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatNumber } from '@/lib/utils';
import { useAnalyticsOverview } from '../hooks/use-analytics';
import { ProductsByCategoryChart } from './products-by-category-chart';
import { InventoryDistributionChart } from './inventory-distribution-chart';
import { ProductStatusChart } from './product-status-chart';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const statCards = [
  {
    title: 'Total Products',
    key: 'productCount',
    icon: Package,
    value: 0,
    trend: 12.5,
    trendUp: true,
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Categories',
    key: 'categoryCount',
    icon: FolderTree,
    value: 0,
    trend: 8,
    trendUp: true,
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'Low Stock',
    key: 'lowStockCount',
    icon: AlertTriangle,
    value: 0,
    trend: 0.8,
    trendUp: false,
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-600',
  },
  {
    title: 'Active Listings',
    key: 'active',
    icon: TrendingUp,
    value: 0,
    trend: 21,
    trendUp: true,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-600',
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
    active: data?.productCount ?? 0,
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-8">
      {/* Welcome banner – blue gradient */}
      <div className="overflow-hidden rounded-2xl bg-gradient-primary p-6 text-white shadow-card md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {greeting}, here&apos;s what&apos;s happening
            </h2>
            <p className="mt-1 text-sm opacity-95">
              {stats.productCount} products · {stats.categoryCount} categories · {stats.lowStockCount} low stock
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/50 bg-transparent text-white hover:bg-white/20"
              asChild
            >
              <Link href={ROUTES.ANALYTICS}>View analytics</Link>
            </Button>
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href={ROUTES.PRODUCTS}>New product</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metric cards – white, rounded, shadow */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key] ?? card.value;
          const trend = card.trend;
          const trendUp = card.trendUp;
          return (
            <Card
              key={card.key}
              className="overflow-hidden rounded-2xl border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
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
                  {trend}% from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
