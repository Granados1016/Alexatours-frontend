"use client";

import { useState } from "react";

interface Props {
  imagenes: string[];
  nombre: string;
}

export default function GaleriaPaquete({ imagenes, nombre }: Props) {
  const [activa, setActiva] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (imagenes.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="font-heading text-xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
        📸 Galería de fotos
      </h2>

      {/* Imagen principal */}
      <div
        className="relative w-full h-64 rounded-xl overflow-hidden mb-3 cursor-pointer group"
        onClick={() => setLightbox(true)}
      >
        <img
          src={imagenes[activa]}
          alt={`${nombre} — foto ${activa + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity">
            🔍 Ampliar
          </span>
        </div>
        {/* Navegación */}
        {imagenes.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiva((a) => (a - 1 + imagenes.length) % imagenes.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow text-sm font-bold"
              style={{ color: "#0A5D8F" }}
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiva((a) => (a + 1) % imagenes.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow text-sm font-bold"
              style={{ color: "#0A5D8F" }}
            >
              ›
            </button>
          </>
        )}
        {/* Contador */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          {activa + 1} / {imagenes.length}
        </div>
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiva(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === activa ? "border-[#D9B96E]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
          {imagenes.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiva((a) => (a - 1 + imagenes.length) % imagenes.length); }}
                className="absolute left-4 text-white text-3xl w-12 h-12 rounded-full hover:bg-white/20 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiva((a) => (a + 1) % imagenes.length); }}
                className="absolute right-4 text-white text-3xl w-12 h-12 rounded-full hover:bg-white/20 flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}
          <img
            src={imagenes[activa]}
            alt={`${nombre} — foto ${activa + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/60 text-sm">
            {activa + 1} / {imagenes.length}
          </p>
        </div>
      )}
    </div>
  );
}
