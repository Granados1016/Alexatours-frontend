"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/auth";

interface ImagenSubida {
  url: string;
  nombre: string;
  fecha: string;
}

const KEY = "alexa_galeria_local";

function getImagenesLocal(): ImagenSubida[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function saveImagenesLocal(imgs: ImagenSubida[]) {
  localStorage.setItem(KEY, JSON.stringify(imgs));
}

export default function AdminGaleriaPage() {
  const [imagenes, setImagenes] = useState<ImagenSubida[]>(() => getImagenesLocal());
  const [subiendo, setSubiendo] = useState(false);
  const [copiadaUrl, setCopiadaUrl] = useState<string | null>(null);
  const [urlManual, setUrlManual] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const subirArchivo = async (file: File) => {
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const nueva = { url: data.url, nombre: file.name, fecha: new Date().toISOString() };
        const actualizadas = [nueva, ...imagenes];
        setImagenes(actualizadas);
        saveImagenesLocal(actualizadas);
      }
    } catch (e) {
      console.error("Error subiendo imagen", e);
    } finally {
      setSubiendo(false);
    }
  };

  const agregarUrlManual = () => {
    if (!urlManual.trim()) return;
    const nombre = urlManual.split("/").pop() || "imagen";
    const nueva = { url: urlManual.trim(), nombre, fecha: new Date().toISOString() };
    const actualizadas = [nueva, ...imagenes];
    setImagenes(actualizadas);
    saveImagenesLocal(actualizadas);
    setUrlManual("");
  };

  const copiar = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiadaUrl(url);
    setTimeout(() => setCopiadaUrl(null), 2000);
  };

  const eliminarLocal = (url: string) => {
    const actualizadas = imagenes.filter((i) => i.url !== url);
    setImagenes(actualizadas);
    saveImagenesLocal(actualizadas);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Galería de Imágenes</h1>
        <p className="text-sm text-gray-400 mt-1">{imagenes.length} imagen(es) guardadas</p>
      </div>

      {/* Panel de subida */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-sm mb-4" style={{ color: "#0A5D8F" }}>Agregar imagen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subir archivo */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#0E84C7] transition-colors"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && subirArchivo(e.target.files[0])}
            />
            {subiendo ? (
              <p className="text-sm text-gray-400 animate-pulse">Subiendo...</p>
            ) : (
              <>
                <p className="text-3xl mb-2">📤</p>
                <p className="text-sm font-medium text-gray-500">Clic para subir imagen</p>
                <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP — máx 5MB</p>
              </>
            )}
          </div>

          {/* URL manual */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">O pega una URL de imagen</label>
            <input
              type="url"
              value={urlManual}
              onChange={(e) => setUrlManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregarUrlManual()}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E84C7]"
            />
            <button onClick={agregarUrlManual} disabled={!urlManual.trim()}
              className="py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: "#0E84C7" }}>
              Agregar URL
            </button>
            <p className="text-xs text-gray-300">Útil para imágenes de Cloudinary, Unsplash, etc.</p>
          </div>
        </div>
      </div>

      {/* Grid de imágenes */}
      {imagenes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🖼️</p>
          <p className="text-sm">No hay imágenes todavía. Sube la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {imagenes.map((img) => (
            <div key={img.url} className="group relative bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-square overflow-hidden">
                <img src={img.url} alt={img.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copiar(img.url)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow hover:scale-110 transition-transform"
                  title="Copiar URL"
                >
                  {copiadaUrl === img.url ? "✅" : "📋"}
                </button>
                <button
                  onClick={() => eliminarLocal(img.url)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm shadow hover:scale-110 transition-transform"
                  title="Eliminar de galería"
                >
                  ×
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-400 truncate">{img.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-300 mt-6 text-center">
        Las imágenes se guardan localmente en el navegador. Al copiar la URL puedes pegarla en cualquier paquete, destino o artículo del blog.
      </p>
    </div>
  );
}
