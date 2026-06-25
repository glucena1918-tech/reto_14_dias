"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslation } from "@/hooks/useTranslation";
import { GlowButton } from "@/components/ui/GlowButton";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface AvatarCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (croppedBlob: Blob) => void;
  saving?: boolean;
}

// Helper to load image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

// Helper for radian angle
function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

// Helper to get size of rotated rectangle
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

// Utility: crop the image using canvas with rotation support
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate context to center, rotate, and translate back
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw original image
  ctx.drawImage(image, 0, 0);

  // Create canvas for the cropped area
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) throw new Error("Cropped canvas context not available");

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw cropped region from the rotated bounding-box canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/webp",
      0.85
    );
  });
}

export function AvatarCropper({
  imageSrc,
  onCancel,
  onSave,
  saving = false,
}: AvatarCropperProps) {
  const { language } = useTranslation();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onSave(blob);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg glass-card p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-base-content">
            {language === "en" ? "Edit Photo" : "Editar Foto"}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-base-content/40 hover:text-base-content/70 hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden bg-black/40 mb-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="space-y-3 mb-5">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-base-content/40 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-primary cursor-pointer"
              aria-label="Zoom"
            />
            <ZoomIn size={16} className="text-base-content/40 shrink-0" />
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <RotateCw size={16} className="text-base-content/40 shrink-0" />
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-primary cursor-pointer"
              aria-label={language === "en" ? "Rotation" : "Rotación"}
            />
            <span className="text-xs text-base-content/30 w-8 text-right">
              {rotation}°
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <GlowButton
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2.5 text-xs"
          >
            {language === "en" ? "Cancel" : "Cancelar"}
          </GlowButton>
          <GlowButton
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 text-xs flex items-center justify-center gap-2"
          >
            {saving
              ? (language === "en" ? "Saving..." : "Guardando...")
              : (language === "en" ? "Save" : "Guardar")}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
