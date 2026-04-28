"use client";

import { useState, useRef } from "react";
import { getToken } from "@/lib/auth";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagen" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local inmediato
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Error al subir imagen");
      const { url } = await res.json();
      onChange(url);
      setPreview(url);
    } catch {
      alert("Error al subir la imagen. Verifica las credenciales de Cloudinary en el backend.");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>
        {label}
      </label>

      {/* Preview */}
      {(preview || value) && (
        <div className="mb-2 rounded-xl overflow-hidden h-40 bg-gray-100">
          <img
            src={preview || value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={() => setPreview("")}
          />
        </div>
      )}

      <div className="flex gap-2">
        {/* Upload desde PC */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors disabled:opacity-60"
          style={{ borderColor: "#0E84C7", color: "#0E84C7" }}
        >
          {uploading ? "⏳ Subiendo..." : "📁 Subir desde PC"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {/* O pegar URL */}
        <input
          type="url"
          placeholder="O pega una URL"
          value={value}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Sube desde tu PC (va a Cloudinary) o pega una URL directamente.
      </p>
    </div>
  );
}
