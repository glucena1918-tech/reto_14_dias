"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LogOut, Sparkles } from "lucide-react";

interface WelcomeContentProps {
  firstName: string;
}

export default function WelcomeContent({ firstName }: WelcomeContentProps) {
  const { language } = useTranslation();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Clear cookies and session on the server side
      await fetch("/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Error signing out on server:", error);
    }

    // Also sign out on the client side to clear memory
    const supabase = createClient();
    await supabase.auth.signOut();

    // Use full reload to clear all Next.js router cache and ensure cookies are updated
    window.location.href = "/login";
  };

  return (
    <div className="relative min-h-full flex items-center justify-center">
      {/* Language switcher */}
      <div className="absolute top-0 right-0 z-30">
        <LanguageSwitcher />
      </div>

      {/* Background glowing orbs */}
      <div
        className="fixed top-[10%] left-[5%] w-[500px] h-[500px] rounded-full animate-float-slow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full animate-float-slower pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed top-[40%] right-[15%] w-[400px] h-[400px] rounded-full animate-float pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <GlassCard className="p-10 sm:p-14 text-center">
          {/* Greeting */}
          <div className="animate-fade-in mb-8">
            <p className="text-lg text-base-content/60 mb-2">
              {language === "en"
                ? `Hello, ${firstName} 👋`
                : `Hola, ${firstName} 👋`}
            </p>
          </div>

          {/* Animated ring */}
          <div className="flex justify-center mb-10 animate-fade-in-delay-1">
            <div className="relative w-32 h-32">
              {/* Outer spinning ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  background:
                    "conic-gradient(from 0deg, #7C3AED, #EC4899, #F97316, #38BDF8, #7C3AED)",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                }}
              />
              {/* Inner glow */}
              <div className="absolute inset-4 rounded-full bg-base-200/50 flex items-center justify-center animate-pulse-glow">
                <Sparkles size={36} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-4 animate-fade-in-delay-2">
            {language === "en"
              ? "Welcome to the Micro-Apps Portal!"
              : "¡Bienvenido al Portal de Micro-Apps!"}
          </h1>

          <p className="text-base-content/50 text-lg mb-8 animate-fade-in-delay-2">
            {language === "en"
              ? "We're preparing something incredible for you."
              : "Estamos preparando algo increíble para ti."}
          </p>

          {/* Coming Soon badge */}
          <div className="flex justify-center mb-8 animate-fade-in-delay-3">
            <div className="px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow">
              <span className="text-sm font-semibold text-primary">
                {language === "en" ? "Coming Soon" : "Próximamente"}
              </span>
            </div>
          </div>

          {/* Gradient accent line */}
          <div className="h-[1px] bg-linear-to-r from-transparent via-primary/30 to-transparent mb-6 animate-fade-in-delay-3" />

          {/* Footer text */}
          <p className="text-xs text-base-content/30 mb-8 animate-fade-in-delay-3">
            {language === "en"
              ? "We'll notify you when everything is ready."
              : "Te notificaremos cuando todo esté listo."}
          </p>

          {/* Sign out button */}
          <div className="animate-fade-in-delay-3">
            <GlowButton
              variant="ghost"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2"
            >
              <LogOut size={16} />
              {language === "en" ? "Sign Out" : "Cerrar Sesión"}
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
