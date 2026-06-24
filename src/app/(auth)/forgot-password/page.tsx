"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { language } = useTranslation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback`,
    });

    if (error) {
      toast({
        title:
          language === "en"
            ? `Error: ${error.message}`
            : `Error: ${error.message}`,
        type: "error",
      });
      setLoading(false);
      return;
    }

    toast({
      title:
        language === "en"
          ? "Recovery link sent! Check your email."
          : "¡Enlace de recuperación enviado! Revisa tu correo.",
      type: "success",
    });
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <GlassCard className="p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-base-content/10 shadow-lg flex items-center justify-center bg-base-200 animate-pulse-glow">
            <img
              src="/logo.jpg"
              alt="GL Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center gradient-text mb-2">
          {language === "en" ? "Recover Password" : "Recuperar Contraseña"}
        </h1>
        <p className="text-center text-base-content/50 text-sm mb-8">
          {language === "en"
            ? "Enter your email and we'll send you a recovery link"
            : "Ingresa tu correo y te enviaremos un enlace de recuperación"}
        </p>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <Input
            id="forgot-email"
            type="email"
            placeholder={language === "en" ? "Email" : "Correo electrónico"}
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <GlowButton
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {language === "en"
              ? "Send Recovery Link"
              : "Enviar Enlace de Recuperación"}
          </GlowButton>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-accent-blue/70 hover:text-accent-blue transition-colors"
          >
            <ArrowLeft size={16} />
            {language === "en" ? "Back to sign in" : "Volver a iniciar sesión"}
          </a>
        </div>
      </GlassCard>
    </div>
  );
}
