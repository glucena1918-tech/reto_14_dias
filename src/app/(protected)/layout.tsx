"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { UserProfileProvider } from "@/context/UserProfileContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <UserProfileProvider>
    <div className="fixed inset-0 w-full h-dvh flex overflow-hidden z-0">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Content column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 z-10">
        {/* Header */}
        <Header onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative">
          {/* Ambient orbs — static, no animation */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Hero orb: purple → pink → orange */}
            <div
              className="absolute -top-40 -left-72 w-225 h-225 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.14) 25%, rgba(249,115,22,0.07) 50%, transparent 75%)",
                filter: "blur(80px)",
              }}
            />
            {/* Top-right pink orb */}
            <div
              className="absolute -top-16 -right-10 w-105 h-105 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(236,72,153,0.05) 45%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            {/* Bottom-right blue orb */}
            <div
              className="absolute -bottom-28 -right-20 w-137.5 h-137.5 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </div>

          {/* Content above orbs */}
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
    </UserProfileProvider>
  );
}
