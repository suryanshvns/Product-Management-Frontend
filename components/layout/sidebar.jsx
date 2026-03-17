"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  BarChart3,
  Activity,
  User,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Building2,
  ScrollText,
  Bell,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  ShieldCheck,
  ShoppingCart,
  Building2,
  ScrollText,
  Bell,
  AlertTriangle,
  FileText,
  Settings,
};

export function Sidebar({ collapsed, onToggle, className }) {
  const pathname = usePathname();
  const { hasRole } = useAuth();
  const items = SIDEBAR_ITEMS.filter(
    (item) => !item.requiredRoles || hasRole(item.requiredRoles)
  );

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Product
            </span>
            <span className="text-sm font-normal text-sidebar-muted">
              Platform
            </span>
          </Link>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 rotate-[-90deg] opacity-70" />
                </>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
