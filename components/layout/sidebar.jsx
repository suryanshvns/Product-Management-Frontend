"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  BarChart3,
  Activity,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Building2,
  ScrollText,
  Bell,
  AlertTriangle,
  FileText,
  Settings,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SIDEBAR_ITEMS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

const iconMap = {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  BarChart3,
  Activity,
  User,
  Users,
  ShieldCheck: LayoutDashboard,
  ShoppingCart,
  Building2,
  ScrollText,
  Bell,
  AlertTriangle,
  FileText,
  Settings,
};

const MAIN_HREFS = ["/dashboard", "/dashboard/products", "/dashboard/categories", "/dashboard/orders", "/dashboard/inventory", "/dashboard/analytics", "/dashboard/reports"];
const isMain = (href) => MAIN_HREFS.some((h) => href === h || (h !== "/dashboard" && href.startsWith(h)));

export function Sidebar({ collapsed, onToggle, className }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState(null);
  const { hasRole, user } = useAuth();

  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  const handleNavClick = (e, href) => {
    if (href === pathname) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setNavigatingTo(href);
    router.push(href);
  };

  const items = SIDEBAR_ITEMS.filter(
    (item) => !item.requiredRoles || hasRole(item.requiredRoles)
  );
  const mainItems = items.filter((item) => isMain(item.href));
  const moreItems = items.filter((item) => !isMain(item.href));

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar shadow-card-soft transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
        className
      )}
    >
      {/* Dark gradient header with logo */}
      <div className={cn("flex h-16 items-center bg-gradient-sidebar-header px-4", collapsed && "justify-center")}>
        <Link href="/dashboard" className="flex items-center outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary">
          <BrandLogo variant="sidebar" showName={!collapsed} size={collapsed ? "sm" : "md"} />
        </Link>
      </div>

      {/* White nav with MAIN / MORE */}
      <nav className="flex-1 overflow-y-auto p-3">
        {!collapsed && (
          <>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
              Main
            </p>
            <div className="space-y-0.5">
              {mainItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const loading = navigatingTo === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-muted"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 shrink-0" />
                    )}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <p className="mb-1.5 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
              More
            </p>
            <div className="space-y-0.5">
              {moreItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const loading = navigatingTo === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-muted"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 shrink-0" />
                    )}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            {items.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const loading = navigatingTo === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "flex justify-center rounded-lg p-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-muted"
                  )}
                  title={item.label}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-2 w-full rounded-lg text-sidebar-muted hover:bg-muted hover:text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        {!collapsed && user && (
          <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-muted/40 px-2 py-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-lg bg-primary text-xs font-medium text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {user?.name || "User"}
              </p>
              <p className="truncate text-[10px] text-sidebar-muted">
                {user?.email?.split("@")[0] || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
