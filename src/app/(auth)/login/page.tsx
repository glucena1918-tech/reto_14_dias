"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for verified=true query param
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast({
        title:
          language === "en"
            ? "Email Confirmed! Your account has been verified."
            : "¡Email Confirmado! Tu cuenta ha sido verificada.",
        type: "success",
      });
    }
    if (searchParams.get("error") === "auth-link-failed") {
      toast({
        title:
          language === "en"
            ? "Authentication link failed. Please try again."
            : "El enlace de autenticación falló. Inténtalo de nuevo.",
        type: "error",
      });
    }
  }, [searchParams, toast, language]);

  // Listen for auth state changes — auto-redirect if session appears
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title:
          language === "en"
            ? `Login failed: ${error.message}`
            : `Error al iniciar sesión: ${error.message}`,
        type: "error",
      });
      setLoading(false);
    }
    // Redirect is handled by onAuthStateChange
  };

  return (
    <div className="animate-fade-in">
      <GlassCard className="p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary via-accent-pink to-accent-warm flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center gradient-text mb-2">
          Micro-Apps Portal
        </h1>
        <p className="text-center text-base-content/50 text-sm mb-8">
          {language === "en"
            ? "Your micro applications portal"
            : "Tu portal de micro aplicaciones"}
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            id="login-email"
            type="email"
            placeholder={language === "en" ? "Email" : "Correo electrónico"}
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder={language === "en" ? "Password" : "Contraseña"}
            icon={<Lock size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-base-content/40 hover:text-base-content/70 focus:outline-none transition-colors flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <GlowButton
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {language === "en" ? "Sign In" : "Iniciar Sesión"}
          </GlowButton>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center text-sm">
          <a
            href="/forgot-password"
            className="block text-accent-blue/70 hover:text-accent-blue transition-colors"
          >
            {language === "en"
              ? "Forgot your password?"
              : "¿Olvidaste tu contraseña?"}
          </a>
          <p className="text-base-content/40">
            {language === "en"
              ? "Don't have an account? "
              : "¿No tienes cuenta? "}
            <a
              href="/signup"
              className="text-primary hover:text-accent-pink transition-colors font-medium"
            >
              {language === "en" ? "Sign up" : "Regístrate"}
            </a>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
