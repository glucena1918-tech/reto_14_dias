import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export function GlowButton({
  children,
  variant = "primary",
  className,
  ...props
}: GlowButtonProps) {
  const baseClasses =
    "relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: cn(
      "bg-linear-to-r from-primary via-accent-pink to-accent-warm",
      "text-white glow-button",
      "hover:shadow-[0_0_30px_rgba(124,58,237,0.3),0_0_60px_rgba(236,72,153,0.15)]"
    ),
    ghost: cn(
      "bg-transparent border border-white/10 text-base-content",
      "hover:bg-white/5 hover:border-white/20",
      "hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]"
    ),
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
