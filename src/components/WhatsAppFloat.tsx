"use client";

import { useState, useEffect } from "react";

interface Props {
  waUrl: string;
  mensaje?: string;
}

export default function WhatsAppFloat({ waUrl, mensaje }: Props) {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // Aparece después de 2 segundos
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Tooltip automático después de 5s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 4000);
    }, 5000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  const href = mensaje
    ? `${waUrl}${waUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(mensaje)}`
    : waUrl;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {tooltip && (
        <div
          className="bg-white text-sm font-medium px-4 py-2 rounded-2xl shadow-lg border border-gray-100 max-w-[200px] text-right animate-fade-in"
          style={{ color: "#0A5D8F" }}
        >
          ¿Tienes dudas? ¡Escríbenos! 👋
        </div>
      )}

      {/* Botón */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: "#25D366" }}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.526 5.854L.057 23.57a.75.75 0 00.921.921l5.716-1.469A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      </a>
    </div>
  );
}
