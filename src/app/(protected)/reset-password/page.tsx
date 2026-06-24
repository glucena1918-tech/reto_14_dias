"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title:
          language === "en"
            ? "Passwords do not match."
            : "Las contraseñas no coinciden.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast({
        title:
          language === "en"
            ? `Failed to update password: ${error.message}`
            : `Error al actualizar contraseña: ${error.message}`,
        type: "error",
      });
      setLoading(false);
      return;
    }

    toast({
      title:
        language === "en"
          ? "Password updated successfully! Redirecting to login..."
          : "¡Contraseña actualizada con éxito! Redirigiendo al login...",
      type: "success",
    });

    // Sign out to clear the recovery session cookies
    await supabase.auth.signOut();
    
    setLoading(false);
    
    // Redirect to login
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4 relative" style={{ backgroundImage: "url('/background.jpg')" }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-base-300/60 backdrop-blur-[2px]" />

      <div className="animate-fade-in relative z-10 w-full max-w-md">
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
            {language === "en" ? "New Password" : "Nueva Contraseña"}
          </h1>
          <p className="text-center text-base-content/50 text-sm mb-8">
            {language === "en"
              ? "Enter your new secure password"
              : "Ingresa tu nueva contraseña segura"}
          </p>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              placeholder={language === "en" ? "New Password" : "Nueva Contraseña"}
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
              minLength={6}
              autoComplete="new-password"
            />

            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder={
                language === "en" ? "Confirm Password" : "Confirmar Contraseña"
              }
              icon={<Lock size={18} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />

            <GlowButton
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {language === "en" ? "Update Password" : "Actualizar Contraseña"}
            </GlowButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
