"use client";

import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);
  return { language, setLanguage };
}
