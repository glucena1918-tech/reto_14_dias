"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
        bg-white/5 border border-white/10 text-base-content/70
        hover:bg-white/10 hover:text-base-content transition-all duration-300
        cursor-pointer"
      aria-label="Toggle language"
    >
      <Globe size={14} />
      <span>{language === "es" ? "EN" : "ES"}</span>
    </button>
  );
}
