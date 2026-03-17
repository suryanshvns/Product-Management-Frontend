"use client";

import Link from "next/link";
import { BarChart3, Package, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ProductsByCategoryChart } from "./products-by-category-chart";
import { InventoryDistributionChart } from "./inventory-distribution-chart";
import { ProductStatusChart } from "./product-status-chart";
import { useAnalyticsTopProducts, useAnalyticsProductsByCategory } from "../hooks/use-analytics";
import { ROUTES } from "@/utils/constants";
import { getProductImageUrl } from "@/lib/product-images";

export function AnalyticsView() {
  const { data: topProducts, isLoading: topLoading } = useAnalyticsTopProducts(10);
  const { data: categoriesWithProducts } = useAnalyticsProductsByCategory();

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
              {topProducts.map((p) => {
                const imageUrl = getProductImageUrl(p);
                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/80 px-3 py-2 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="truncate font-medium">{p.name ?? p.title ?? '—'}</span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">{p.status ?? '—'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {Array.isArray(categoriesWithProducts) && categoriesWithProducts.some((c) => Array.isArray(c.products) && c.products.length > 0) && (
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Products by category</CardTitle>
            <p className="text-sm text-muted-foreground">Product thumbnails per category</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoriesWithProducts.map((cat) => {
                const products = Array.isArray(cat.products) ? cat.products.slice(0, 4) : [];
                if (products.length === 0) return null;
                return (
                  <div key={cat.id ?? cat.name} className="rounded-xl border border-border p-3">
                    <p className="mb-2 text-sm font-medium text-foreground">{cat.name ?? cat.categoryName ?? "Uncategorized"}</p>
                    <div className="flex flex-wrap gap-2">
                      {products.map((p) => {
                        const imageUrl = getProductImageUrl(p);
                        return (
                          <div key={p.id} className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted">
                            {imageUrl ? (
                              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
