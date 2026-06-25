"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Languages,
  ChevronsLeft,
  ChevronsRight,
  X,
  Sparkles,
  User,
  CreditCard,
  Settings,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { language } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: language === "en" ? "Micro App #1" : "Micro App #1",
      icon: Languages,
    },
  ];

  const accountItems = [
    {
      href: "/profile",
      label: language === "en" ? "Profile" : "Perfil",
      icon: User,
    },
    {
      href: "/billing",
      label: language === "en" ? "Plans & Billing" : "Planes y Facturación",
      icon: CreditCard,
    },
    {
      href: "/settings",
      label: language === "en" ? "Settings" : "Configuración",
      icon: Settings,
    },
  ];

  const sectionLabel = language === "en" ? "Micro Apps" : "Micro Apps";
  const accountLabel = language === "en" ? "Account" : "Cuenta";

  const isActive = (href: string) => pathname === href;

  // ─── Shared sidebar content ───
  const renderContent = (isMobile: boolean) => {
    const showLabels = isMobile || !collapsed;

    return (
      <div className="flex flex-col h-full">
        {/* Logo / App Name */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-white/5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent-pink shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {showLabels && (
            <span className="text-sm font-bold text-base-content tracking-wide whitespace-nowrap">
              Micro-Apps
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {/* Section header */}
          {showLabels && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-base-content/30">
              {sectionLabel}
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) onCloseMobile();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/15 text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                    : "text-base-content/50 hover:text-base-content/80 hover:bg-white/5",
                  !showLabels && "justify-center px-0"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {showLabels && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}

          {/* Account section */}
          {showLabels && (
            <p className="px-3 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-base-content/30">
              {accountLabel}
            </p>
          )}

          {accountItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) onCloseMobile();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/15 text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                    : "text-base-content/50 hover:text-base-content/80 hover:bg-white/5",
                  !showLabels && "justify-center px-0"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {showLabels && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <div className="shrink-0 border-t border-white/5 p-2">
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-full py-2 rounded-xl text-base-content/30 hover:text-base-content/60 hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight size={18} />
              ) : (
                <ChevronsLeft size={18} />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-full shrink-0 border-r border-white/5 transition-all duration-300",
          "bg-base-200/60 backdrop-blur-xl",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {renderContent(false)}
      </aside>

      {/* ─── Mobile Backdrop ─── */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* ─── Mobile Drawer ─── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 lg:hidden transition-transform duration-300",
          "bg-base-200/95 backdrop-blur-2xl border-r border-white/5",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={onCloseMobile}
          className="absolute top-4 right-4 p-1 rounded-lg text-base-content/40 hover:text-base-content/70 hover:bg-white/5 transition-all cursor-pointer z-10"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
        {renderContent(true)}
      </aside>
    </>
  );
}
