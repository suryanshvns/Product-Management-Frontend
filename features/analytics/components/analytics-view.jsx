"use client";

import Link from "next/link";
import { BarChart3, Package, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ProductsByCategoryChart } from "./products-by-category-chart";
import { InventoryDistributionChart } from "./inventory-distribution-chart";
import { ProductStatusChart } from "./product-status-chart";
import { useAnalyticsTopProducts } from "../hooks/use-analytics";
import { ROUTES } from "@/utils/constants";

export function AnalyticsView() {
  const { data: topProducts, isLoading: topLoading } = useAnalyticsTopProducts(10);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BarChart3}
        title="Analytics"
        description="Charts and insights for products, categories, and inventory."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductsByCategoryChart />
        <InventoryDistributionChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <ProductStatusChart />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Top / latest products</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Up to 10 most recent or top products
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.PRODUCTS} className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {topLoading ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : !topProducts?.length ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              No products yet
            </div>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border/80 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {p.name ?? p.title ?? '—'}
                  </span>
                  <span className="text-muted-foreground">{p.status ?? '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
