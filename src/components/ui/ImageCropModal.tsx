"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

type ImageCropModalProps = {
  applyLabel?: string;
  aspectRatio: number;
  errorMessage?: string | null;
  imageSrc: string;
  isApplying?: boolean;
  onApply: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
  title: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function ImageCropModal({
  applyLabel = "Aplicar imagem",
  aspectRatio,
  errorMessage,
  imageSrc,
  isApplying = false,
  onApply,
  onCancel,
  title,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels);
    },
    [],
  );

  function handleApply() {
    if (!croppedAreaPixels || isApplying) {
      return;
    }

    onApply(croppedAreaPixels);
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
        </div>

        <div className="space-y-5 p-6">
          <div className="relative h-[min(62vh,440px)] min-h-72 overflow-hidden rounded-xl bg-slate-950">
            <Cropper
              aspect={aspectRatio}
              crop={crop}
              cropShape="rect"
              image={imageSrc}
              maxZoom={MAX_ZOOM}
              minZoom={MIN_ZOOM}
              objectFit="contain"
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              showGrid
              zoom={zoom}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Zoom
            </span>
            <input
              className="h-2 w-full cursor-pointer accent-blue-600"
              max={MAX_ZOOM}
              min={MIN_ZOOM}
              onChange={(event) => setZoom(Number(event.target.value))}
              step="0.01"
              type="range"
              value={zoom}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200"
            disabled={isApplying}
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={!croppedAreaPixels || isApplying}
            onClick={handleApply}
            type="button"
          >
            {isApplying ? "Aplicando..." : applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
