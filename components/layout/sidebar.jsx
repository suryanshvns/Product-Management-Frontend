"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  BarChart3,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  ScrollText,
  Bell,
  FileText,
  Settings,
  Loader2,
  Tag,
  Layers,
  Search,
  Link2,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Ticket,
  Contact,
  UsersRound,
  MapPin,
  Star,
  Heart,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SIDEBAR_GROUPS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

const iconMap = {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  BarChart3,
  User,
  Users,
  ShoppingCart,
  ScrollText,
  Bell,
  FileText,
  Settings,
  Tag,
  Layers,
  Search,
  Link2,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Ticket,
  Contact,
  UsersRound,
  MapPin,
  Star,
  Heart,
  ListOrdered,
};

function groupHasActivePath(items, pathname) {
  return items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );
}

export function Sidebar({ collapsed, onToggle, className }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState(null);
  const { hasRole, user } = useAuth();

  const groups = useMemo(() => {
    return SIDEBAR_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (item) => !item.requiredRoles || hasRole(item.requiredRoles)
      ),
    })).filter((g) => g.items.length > 0);
  }, [hasRole]);

  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    SIDEBAR_GROUPS.forEach((g) => {
      init[g.id] = g.defaultOpen !== false;
    });
    return init;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        if (groupHasActivePath(g.items, pathname)) next[g.id] = true;
      });
      return next;
    });
  }, [pathname, groups]);

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

  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const renderLink = (item) => {
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
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          collapsed ? "justify-center px-2 py-2.5" : "",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground hover:bg-muted"
        )}
        title={collapsed ? item.label : undefined}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
        ) : (
          <Icon className="h-5 w-5 shrink-0" />
        )}
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar shadow-card-soft transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center bg-gradient-sidebar-header px-4",
          collapsed && "justify-center"
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BrandLogo
            variant="sidebar"
            showName={!collapsed}
            size={collapsed ? "sm" : "md"}
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {!collapsed &&
          groups.map((group) => {
            const isOpen = openGroups[group.id] !== false;
            return (
              <div key={group.id} className="mb-1">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((p) => ({
                      ...p,
                      [group.id]: !isOpen,
                    }))
                  }
                  className="mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted hover:bg-muted/60"
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform",
                      !isOpen && "-rotate-90"
                    )}
                  />
                  {group.label}
                </button>
                {isOpen && (
                  <div className="space-y-0.5 pl-1">{group.items.map(renderLink)}</div>
                )}
              </div>
            );
          })}
        {collapsed && (
          <div className="space-y-0.5">{flatItems.map(renderLink)}</div>
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
