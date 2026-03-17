'use client';

import {
  Package,
  AlertTriangle,
  CheckCircle,
  Archive,
  Warehouse,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { TableSkeleton } from '@/components/shared/skeleton';
import { formatNumber } from '@/lib/utils';
import { useAnalyticsInventoryStatus } from '@/features/analytics/hooks/use-analytics';

const summaryCards = [
  { title: 'Total SKUs', key: 'total', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/12' },
  { title: 'In stock', key: 'inStock', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/12' },
  { title: 'Low stock', key: 'lowStock', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/12' },
  { title: 'Out of stock', key: 'outOfStock', icon: Archive, color: 'text-red-400', bg: 'bg-red-500/12' },
];

export function InventoryView() {
  const { data, isLoading: summaryLoading, isError, refetch } = useAnalyticsInventoryStatus();

  const total = data?.total ?? 0;
  const inStock = data?.inStock ?? 0;
  const lowStock = data?.lowStock ?? 0;
  const summary = {
    total,
    inStock,
    lowStock,
    outOfStock: Math.max(0, total - inStock - lowStock),
  };
  const items = Array.isArray(data?.lowStockItems) ? data.lowStockItems : [];

  const columns = [
    { key: 'productName', header: 'Product', render: (_, row) => row.productName ?? row.name ?? row.product?.name ?? '—' },
    { key: 'sku', header: 'SKU', render: (_, row) => row.sku ?? row.product?.sku ?? '—' },
    { key: 'quantity', header: 'Quantity', render: (_, row) => formatNumber(row.quantity ?? row.stock ?? 0) },
    { key: 'lowStockThreshold', header: 'Low stock threshold', render: (_, row) => formatNumber(row.lowStockThreshold ?? row.threshold ?? '—') },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="warning">Low stock</Badge>,
    },
  ];

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Warehouse}
        title="Inventory"
        description="Track stock levels and low stock warnings."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {formatNumber(summary[card.key] ?? 0)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low stock items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Products at or below low stock threshold
          </p>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <DataTable
              columns={columns}
              data={items}
              keyExtractor={row => row.productId ?? row.id ?? row.product?.id ?? String(row.productName)}
              emptyMessage="No low stock items."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
