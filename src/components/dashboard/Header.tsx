"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserProfile } from "@/context/UserProfileContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Input } from "@/components/ui/Input";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

// Static notification data to avoid hydration mismatch
const NOTIFICATIONS = [
  {
    id: "n1",
    title: "New user registered",
    titleEs: "Nuevo usuario registrado",
    time: "2m",
    read: false,
  },
  {
    id: "n2",
    title: "Monthly report ready",
    titleEs: "Informe mensual listo",
    time: "1h",
    read: true,
  },
  {
    id: "n3",
    title: "Server update completed",
    titleEs: "Actualización del servidor completada",
    time: "3h",
    read: true,
  },
];

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const { language } = useTranslation();
  const router = useRouter();
  const { profile } = useUserProfile();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Error signing out on server:", error);
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="shrink-0 h-16 relative z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-base-200/40 backdrop-blur-xl">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="hidden sm:block w-64 lg:w-80">
          <Input
            icon={<Search size={16} />}
            placeholder={
              language === "en" ? "Search..." : "Buscar..."
            }
            rightElement={
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-base-content/30 font-mono">
                ⌘K
              </kbd>
            }
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-white/5 transition-all cursor-pointer"
            aria-label={
              language === "en" ? "Notifications" : "Notificaciones"
            }
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent-pink text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-[#0A0520] border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-semibold text-base-content">
                  {language === "en" ? "Notifications" : "Notificaciones"}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-base-content/80">
                        {language === "en" ? n.title : n.titleEs}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-base-content/30 mt-1">
                      {language === "en"
                        ? `${n.time} ago`
                        : `hace ${n.time}`}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-white/5">
                <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
                  {language === "en"
                    ? "View all notifications"
                    : "Ver todas las notificaciones"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar & dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
          >
            {/* Avatar — show image if available, otherwise initials */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent-pink flex items-center justify-center text-xs font-bold text-white shrink-0">
                {profile.userInitials || "?"}
              </div>
            )}
            <span className="hidden md:block text-sm text-base-content/70 max-w-24 truncate">
              {profile.userName}
            </span>
            <ChevronDown
              size={14}
              className="hidden md:block text-base-content/30"
            />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl bg-[#0A0520] border border-white/20 shadow-2xl overflow-hidden animate-fade-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-accent-pink flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {profile.userInitials || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-base-content truncate">
                    {profile.userName}
                  </p>
                  <p className="text-xs text-base-content/40 truncate">
                    {profile.userEmail}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/60 hover:text-base-content hover:bg-white/5 transition-all cursor-pointer"
                >
                  <User size={16} />
                  {language === "en" ? "Profile" : "Perfil"}
                </Link>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/60 hover:text-base-content hover:bg-white/5 transition-all cursor-pointer"
                >
                  <Settings size={16} />
                  {language === "en" ? "Settings" : "Configuración"}
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-white/5 py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  {language === "en" ? "Log Out" : "Cerrar Sesión"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
