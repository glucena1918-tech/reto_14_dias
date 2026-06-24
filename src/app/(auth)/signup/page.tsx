"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${origin}/login?verified=true`,
      },
    });

    if (error) {
      let errorMessage = error.message;
      if (!errorMessage || errorMessage === "{}" || errorMessage === "null") {
        errorMessage =
          language === "en"
            ? "SMTP configuration or network error. Please check your Supabase Auth logs."
            : "Error de configuración SMTP o de red. Por favor verifica los logs de Supabase Auth.";
      }

      toast({
        title:
          language === "en"
            ? `Sign up failed: ${errorMessage}`
            : `Error al registrarse: ${errorMessage}`,
        type: "error",
      });
      setLoading(false);
      return;
    }

    toast({
      title:
        language === "en"
          ? "Account created! Check your email to verify your account."
          : "¡Cuenta creada! Revisa tu correo para verificar tu cuenta.",
      type: "success",
    });

    setLoading(false);
    router.push("/login");
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
          {language === "en" ? "Create Account" : "Crear Cuenta"}
        </h1>
        <p className="text-center text-base-content/50 text-sm mb-8">
          {language === "en"
            ? "Join the Micro-Apps Portal"
            : "Únete al Portal de Micro-Apps"}
        </p>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="signup-first-name"
              type="text"
              placeholder={language === "en" ? "First Name" : "Nombre"}
              icon={<User size={18} />}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
            <Input
              id="signup-last-name"
              type="text"
              placeholder={language === "en" ? "Last Name" : "Apellido"}
              icon={<User size={18} />}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>

          <Input
            id="signup-email"
            type="email"
            placeholder={language === "en" ? "Email" : "Correo electrónico"}
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            id="signup-password"
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
            minLength={6}
            autoComplete="new-password"
          />

          <GlowButton
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {language === "en" ? "Create Account" : "Crear Cuenta"}
          </GlowButton>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <p className="text-base-content/40">
            {language === "en"
              ? "Already have an account? "
              : "¿Ya tienes cuenta? "}
            <a
              href="/login"
              className="text-primary hover:text-accent-pink transition-colors font-medium"
            >
              {language === "en" ? "Sign in" : "Inicia sesión"}
            </a>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
