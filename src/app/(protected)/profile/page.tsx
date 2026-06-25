"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { useUserProfile } from "@/context/UserProfileContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { AvatarCropper } from "@/components/dashboard/AvatarCropper";
import {
  Camera,
  Pencil,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Star,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const { profile, refreshProfile } = useUserProfile();

  // Form state — initialized from context
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [formInitialized, setFormInitialized] = useState(false);

  // Sync form with profile once loaded
  if (!formInitialized && profile.firstName) {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setPhone(profile.phone);
    setFormInitialized(true);
  }
  // Also sync if profile has email but no name (user with email-only)
  if (!formInitialized && profile.userEmail && !profile.firstName) {
    setFormInitialized(true);
  }

  const [saving, setSaving] = useState(false);

  // Avatar cropper state
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [uploadingSaving, setUploadingSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title:
          language === "en"
            ? "Image must be smaller than 3MB"
            : "La imagen debe ser menor a 3MB",
        type: "error",
      });
      return;
    }

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({
        title:
          language === "en"
            ? "Only JPG, PNG, and WebP are allowed"
            : "Solo se permiten JPG, PNG y WebP",
        type: "error",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setCropperSrc(url);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  // Handle cropped avatar upload
  const handleCroppedSave = async (blob: Blob) => {
    setUploadingSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const filePath = `${user.id}/avatar.webp`;

      // Upload to storage (upsert)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add cache-busting timestamp
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update users table
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Refresh profile context so Header updates immediately
      await refreshProfile();

      toast({
        title:
          language === "en"
            ? "Photo updated successfully!"
            : "¡Foto actualizada con éxito!",
        type: "success",
      });

      setCropperSrc(null);
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast({
        title:
          language === "en"
            ? "Error uploading photo. Please try again."
            : "Error al subir la foto. Intenta de nuevo.",
        type: "error",
      });
    } finally {
      setUploadingSaving(false);
    }
  };

  // Handle profile form save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title:
          language === "en"
            ? "Profile updated successfully!"
            : "¡Perfil actualizado con éxito!",
        type: "success",
      });
    } catch (err) {
      console.error("Profile save error:", err);
      toast({
        title:
          language === "en"
            ? "Error saving profile. Please try again."
            : "Error al guardar perfil. Intenta de nuevo.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const roleLabel =
    profile.role === "admin"
      ? language === "en"
        ? "Administrator"
        : "Administrador"
      : language === "en"
        ? "User"
        : "Usuario";

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-8 pb-12">
        {/* Page title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {language === "en" ? "My Profile" : "Mi Perfil"}
          </h1>
          <p className="text-base-content/40 text-sm mt-1">
            {language === "en"
              ? "Manage your personal information"
              : "Administra tu información personal"}
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left Column: Avatar & Info ─── */}
          <GlassCard className="p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative group mb-5">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary to-accent-pink flex items-center justify-center text-4xl font-bold text-white">
                    {profile.userInitials || "?"}
                  </div>
                )}
              </div>

              {/* Overlay buttons */}
              <div className="absolute inset-0 rounded-full flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Upload new */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all cursor-pointer"
                  aria-label={
                    language === "en" ? "Upload photo" : "Subir foto"
                  }
                >
                  <Camera size={18} />
                </button>
                {/* Edit existing (re-crop) */}
                {profile.avatarUrl && (
                  <button
                    onClick={() => {
                      // Use the current avatar for re-cropping
                      setCropperSrc(profile.avatarUrl);
                    }}
                    className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all cursor-pointer"
                    aria-label={
                      language === "en" ? "Edit photo" : "Editar foto"
                    }
                  >
                    <Pencil size={18} />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Upload & Edit Buttons */}
            <div className="flex gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <Camera size={14} />
                {language === "en" ? "Upload Photo" : "Subir Foto"}
              </button>
              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    // Use the current avatar for re-cropping
                    setCropperSrc(profile.avatarUrl);
                  }}
                  className="text-xs text-base-content/60 hover:text-base-content font-medium transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <Pencil size={14} />
                  {language === "en" ? "Edit Photo" : "Editar Foto"}
                </button>
              )}
            </div>

            {/* User name */}
            <h2 className="text-lg font-semibold text-base-content mb-1">
              {profile.userName || "—"}
            </h2>
            <p className="text-sm text-base-content/40 mb-5">
              {profile.userEmail}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-white/5 mb-5" />

            {/* Info badges */}
            <div className="w-full space-y-3">
              {/* Level */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3">
                <Star size={16} className="text-accent-warm shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-base-content/30">
                    {language === "en" ? "Level" : "Nivel"}
                  </p>
                  <p className="text-sm font-medium text-base-content">
                    {language === "en" ? "Member" : "Miembro"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3">
                <Shield size={16} className="text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-base-content/30">
                    {language === "en" ? "Role" : "Rol"}
                  </p>
                  <p className="text-sm font-medium text-base-content">
                    {roleLabel}
                  </p>
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3">
                <Calendar size={16} className="text-accent-blue shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-base-content/30">
                    {language === "en" ? "Joined" : "Registro"}
                  </p>
                  <p className="text-sm font-medium text-base-content">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ─── Right Column: Edit Form ─── */}
          <GlassCard className="p-6 sm:p-8 lg:col-span-2">
            <h2 className="text-lg font-semibold text-base-content mb-6">
              {language === "en"
                ? "Personal Information"
                : "Información Personal"}
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <Input
                  id="profile-first-name"
                  label={language === "en" ? "First Name" : "Nombre"}
                  icon={<User size={16} />}
                  placeholder={
                    language === "en" ? "Your first name" : "Tu nombre"
                  }
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                {/* Last Name */}
                <Input
                  id="profile-last-name"
                  label={language === "en" ? "Last Name" : "Apellido"}
                  icon={<User size={16} />}
                  placeholder={
                    language === "en" ? "Your last name" : "Tu apellido"
                  }
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Email (read-only) */}
              <Input
                id="profile-email"
                label={language === "en" ? "Email" : "Correo Electrónico"}
                icon={<Mail size={16} />}
                value={profile.userEmail}
                readOnly
                className="opacity-60 cursor-not-allowed"
              />

              {/* Phone */}
              <Input
                id="profile-phone"
                label={language === "en" ? "Phone" : "Teléfono"}
                icon={<Phone size={16} />}
                placeholder={
                  language === "en"
                    ? "+1 (555) 000-0000"
                    : "+52 (55) 0000-0000"
                }
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Save button */}
              <div className="flex justify-end">
                <GlowButton
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2.5 text-sm flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? (language === "en" ? "Saving..." : "Guardando...")
                    : (language === "en" ? "Save Changes" : "Guardar Cambios")}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>

      {/* Avatar Cropper Modal */}
      {cropperSrc && (
        <AvatarCropper
          imageSrc={cropperSrc}
          onCancel={() => setCropperSrc(null)}
          onSave={handleCroppedSave}
          saving={uploadingSaving}
        />
      )}
    </>
  );
}
