"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettings, type Theme, type FontSize } from "@/context/SettingsContext";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Sun,
  Moon,
  Type,
  Minimize2,
  Eye,
  Bell,
  Mail,
  Smartphone,
  CalendarDays,
  Globe,
  AlertTriangle,
  LogOut,
  Trash2,
  RotateCcw,
  Check,
} from "lucide-react";

// ── Componente Toggle reutilizable ──
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${
        checked
          ? "bg-primary shadow-[0_0_12px_rgba(124,58,237,0.4)]"
          : "bg-white/10 border border-white/10"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${
          checked ? "left-[calc(100%-1.375rem)]" : "left-0.5"
        }`}
      />
    </button>
  );
}

// ── Componente de fila de ajuste ──
function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 shrink-0 text-base-content/30">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-base-content">{label}</p>
          <p className="text-xs text-base-content/40 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { language, setLanguage } = useTranslation();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { toast } = useToast();
  const isEn = language === "en";

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // ── Manejadores ──
  const handleThemeChange = (theme: Theme) => {
    updateSetting("theme", theme);
    toast({
      title: isEn
        ? `Theme changed to ${theme === "dark" ? "Dark" : "Light"}`
        : `Tema cambiado a ${theme === "dark" ? "Oscuro" : "Claro"}`,
      type: "success",
    });
  };

  const handleFontSize = (size: FontSize) => {
    updateSetting("fontSize", size);
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: isEn
        ? "Settings reset to defaults"
        : "Configuración restablecida a valores predeterminados",
      type: "success",
    });
  };

  const handleCloseAllSessions = () => {
    toast({
      title: isEn
        ? "All other sessions have been closed"
        : "Todas las demás sesiones han sido cerradas",
      type: "success",
    });
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    toast({
      title: isEn
        ? "This is a demo — account deletion is not available"
        : "Esto es una demo — la eliminación de cuenta no está disponible",
      type: "error",
    });
  };

  const fontSizeOptions: { value: FontSize; labelEn: string; labelEs: string }[] = [
    { value: "small", labelEn: "Small", labelEs: "Pequeño" },
    { value: "medium", labelEn: "Medium", labelEs: "Mediano" },
    { value: "large", labelEn: "Large", labelEs: "Grande" },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
        {/* ── Título ── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {isEn ? "Settings" : "Configuración"}
          </h1>
          <p className="text-base-content/40 text-sm mt-1">
            {isEn
              ? "Customize your experience and preferences"
              : "Personaliza tu experiencia y preferencias"}
          </p>
        </div>

        {/* ═══════ 1. APARIENCIA ═══════ */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-base-content mb-1">
            {isEn ? "Appearance" : "Apariencia"}
          </h2>
          <p className="text-xs text-base-content/40 mb-5">
            {isEn
              ? "Customize the look and feel of the application"
              : "Personaliza la apariencia de la aplicación"}
          </p>

          {/* Tema */}
          <SettingRow
            icon={<Sun size={18} />}
            label={isEn ? "Theme" : "Tema"}
            description={
              isEn
                ? "Switch between dark and light mode"
                : "Cambia entre modo oscuro y claro"
            }
          >
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  settings.theme === "dark"
                    ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                    : "text-base-content/40 hover:text-base-content/70"
                }`}
              >
                <Moon size={14} />
                {isEn ? "Dark" : "Oscuro"}
              </button>
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  settings.theme === "light"
                    ? "bg-accent-warm/20 text-accent-warm shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                    : "text-base-content/40 hover:text-base-content/70"
                }`}
              >
                <Sun size={14} />
                {isEn ? "Light" : "Claro"}
              </button>
            </div>
          </SettingRow>

          {/* Tamaño de fuente */}
          <SettingRow
            icon={<Type size={18} />}
            label={isEn ? "Font Size" : "Tamaño de Fuente"}
            description={
              isEn
                ? "Adjust the base text size across the app"
                : "Ajusta el tamaño base del texto en toda la app"
            }
          >
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              {fontSizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFontSize(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                    settings.fontSize === opt.value
                      ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                      : "text-base-content/40 hover:text-base-content/70"
                  }`}
                >
                  {isEn ? opt.labelEn : opt.labelEs}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Vista previa de fuente */}
          <div className="mt-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-base-content/30 mb-2">
              {isEn ? "Preview" : "Vista Previa"}
            </p>
            <p className="text-base-content/70 leading-relaxed">
              {isEn
                ? "The quick brown fox jumps over the lazy dog. This sentence shows how text will look with your current font size."
                : "El veloz murciélago hindú comía feliz cardillo y kiwi. Esta oración muestra cómo se verá el texto con tu tamaño de fuente actual."}
            </p>
          </div>

          {/* Modo compacto */}
          <SettingRow
            icon={<Minimize2 size={18} />}
            label={isEn ? "Compact Mode" : "Modo Compacto"}
            description={
              isEn
                ? "Reduce spacing and padding for a denser layout"
                : "Reduce el espaciado para un diseño más compacto"
            }
          >
            <Toggle
              id="toggle-compact"
              checked={settings.compactMode}
              onChange={(val) => updateSetting("compactMode", val)}
            />
          </SettingRow>
        </GlassCard>

        {/* ═══════ 2. ACCESIBILIDAD ═══════ */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-base-content mb-1">
            {isEn ? "Accessibility" : "Accesibilidad"}
          </h2>
          <p className="text-xs text-base-content/40 mb-5">
            {isEn
              ? "Options to make the app more comfortable to use"
              : "Opciones para hacer la app más cómoda de usar"}
          </p>

          <SettingRow
            icon={<Eye size={18} />}
            label={isEn ? "Reduce Motion" : "Reducir Animaciones"}
            description={
              isEn
                ? "Disable all animations and transitions"
                : "Desactiva todas las animaciones y transiciones"
            }
          >
            <Toggle
              id="toggle-reduce-motion"
              checked={settings.reduceMotion}
              onChange={(val) => updateSetting("reduceMotion", val)}
            />
          </SettingRow>
        </GlassCard>

        {/* ═══════ 3. NOTIFICACIONES ═══════ */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-base-content mb-1">
            {isEn ? "Notifications" : "Notificaciones"}
          </h2>
          <p className="text-xs text-base-content/40 mb-5">
            {isEn
              ? "Manage how you receive updates"
              : "Administra cómo recibes actualizaciones"}
          </p>

          <SettingRow
            icon={<Mail size={18} />}
            label={isEn ? "Email Notifications" : "Notificaciones por Email"}
            description={
              isEn
                ? "Receive updates and alerts via email"
                : "Recibe actualizaciones y alertas por correo electrónico"
            }
          >
            <Toggle
              id="toggle-email-notif"
              checked={settings.emailNotifications}
              onChange={(val) => updateSetting("emailNotifications", val)}
            />
          </SettingRow>

          <SettingRow
            icon={<Smartphone size={18} />}
            label={isEn ? "Push Notifications" : "Notificaciones Push"}
            description={
              isEn
                ? "Get push notifications on your devices"
                : "Recibe notificaciones push en tus dispositivos"
            }
          >
            <Toggle
              id="toggle-push-notif"
              checked={settings.pushNotifications}
              onChange={(val) => updateSetting("pushNotifications", val)}
            />
          </SettingRow>

          <SettingRow
            icon={<CalendarDays size={18} />}
            label={isEn ? "Weekly Digest" : "Resumen Semanal"}
            description={
              isEn
                ? "Receive a weekly summary of your activity"
                : "Recibe un resumen semanal de tu actividad"
            }
          >
            <Toggle
              id="toggle-weekly-digest"
              checked={settings.weeklyDigest}
              onChange={(val) => updateSetting("weeklyDigest", val)}
            />
          </SettingRow>
        </GlassCard>

        {/* ═══════ 4. IDIOMA ═══════ */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-base-content mb-1">
            {isEn ? "Language" : "Idioma"}
          </h2>
          <p className="text-xs text-base-content/40 mb-5">
            {isEn
              ? "Choose your preferred language"
              : "Elige tu idioma preferido"}
          </p>

          <SettingRow
            icon={<Globe size={18} />}
            label={isEn ? "Interface Language" : "Idioma de la Interfaz"}
            description={
              isEn
                ? "Select the language for the entire application"
                : "Selecciona el idioma para toda la aplicación"
            }
          >
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              <button
                onClick={() => setLanguage("es")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  language === "es"
                    ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                    : "text-base-content/40 hover:text-base-content/70"
                }`}
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  language === "en"
                    ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                    : "text-base-content/40 hover:text-base-content/70"
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </SettingRow>
        </GlassCard>

        {/* ═══════ 5. RESTABLECER ═══════ */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-base-content mb-1">
                {isEn ? "Reset Settings" : "Restablecer Configuración"}
              </h2>
              <p className="text-xs text-base-content/40">
                {isEn
                  ? "Restore all settings to their default values"
                  : "Restaura todos los ajustes a sus valores predeterminados"}
              </p>
            </div>
            <button
              onClick={handleResetSettings}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-base-content/60 hover:text-base-content hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <RotateCcw size={14} />
              {isEn ? "Reset" : "Restablecer"}
            </button>
          </div>
        </GlassCard>

        {/* ═══════ 6. ZONA DE PELIGRO ═══════ */}
        <GlassCard className="p-6 sm:p-8 !border-red-500/10">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-base font-semibold text-red-400">
              {isEn ? "Danger Zone" : "Zona de Peligro"}
            </h2>
          </div>
          <p className="text-xs text-base-content/40 mb-6">
            {isEn
              ? "Irreversible and destructive actions"
              : "Acciones irreversibles y destructivas"}
          </p>

          <div className="space-y-4">
            {/* Cerrar todas las sesiones */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-base-content">
                  {isEn ? "Sign out all devices" : "Cerrar sesión en todos los dispositivos"}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  {isEn
                    ? "This will sign you out of all other active sessions"
                    : "Esto cerrará tu sesión en todas las demás sesiones activas"}
                </p>
              </div>
              <button
                onClick={handleCloseAllSessions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-300 cursor-pointer shrink-0"
              >
                <LogOut size={14} />
                {isEn ? "Sign Out All" : "Cerrar Todas"}
              </button>
            </div>

            {/* Eliminar cuenta */}
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-base-content">
                  {isEn ? "Delete Account" : "Eliminar Cuenta"}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  {isEn
                    ? "Permanently delete your account and all associated data"
                    : "Elimina permanentemente tu cuenta y todos los datos asociados"}
                </p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 cursor-pointer shrink-0"
              >
                <Trash2 size={14} />
                {isEn ? "Delete" : "Eliminar"}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Modal de Confirmación de Eliminación ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-base-200 border border-white/10 shadow-2xl p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-base-content">
                  {isEn ? "Delete Account?" : "¿Eliminar Cuenta?"}
                </h3>
                <p className="text-xs text-base-content/40">
                  {isEn ? "This action cannot be undone" : "Esta acción no se puede deshacer"}
                </p>
              </div>
            </div>

            <p className="text-sm text-base-content/60 mb-6 leading-relaxed">
              {isEn
                ? "Are you sure you want to permanently delete your account? All your data, micro-apps, and settings will be lost forever."
                : "¿Estás seguro de que deseas eliminar permanentemente tu cuenta? Todos tus datos, micro-apps y configuraciones se perderán para siempre."}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-base-content/60 hover:text-base-content hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                {isEn ? "Cancel" : "Cancelar"}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                {isEn ? "Yes, Delete My Account" : "Sí, Eliminar Mi Cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
