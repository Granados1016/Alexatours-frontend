"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState<Mensaje | null>(null);

  const cargar = () => {
    apiFetch("/admin/contacto")
      .then(setMensajes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const abrir = async (m: Mensaje) => {
    setSeleccionado(m);
    if (!m.leido) {
      await apiFetch(`/admin/contacto/${m.id}/leido`, { method: "PUT" });
      setMensajes((prev) => prev.map((x) => x.id === m.id ? { ...x, leido: true } : x));
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await apiFetch(`/admin/contacto/${id}`, { method: "DELETE" });
    if (seleccionado?.id === id) setSeleccionado(null);
    cargar();
  };

  const sinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Mensajes de contacto</h1>
        <p className="text-sm text-gray-400 mt-1">
          {mensajes.length} mensajes{sinLeer > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">{sinLeer} sin leer</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista */}
        <div className="space-y-2">
          {loading ? <p className="text-gray-400">Cargando...</p> :
            mensajes.length === 0 ? (
              <div className="text-center py-16 text-gray-300">
                <p className="text-4xl mb-3">📭</p>
                <p>No hay mensajes aún</p>
              </div>
            ) : mensajes.map((m) => (
              <div
                key={m.id}
                onClick={() => abrir(m)}
                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  seleccionado?.id === m.id ? "border-blue-400" : "border-transparent hover:border-gray-200"
                } ${!m.leido ? "ring-2 ring-blue-100" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!m.leido && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#0A5D8F" }}>{m.nombre}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300 flex-shrink-0">
                    {new Date(m.created_at).toLocaleDateString("es-MX")}
                  </span>
                </div>
                {m.asunto && <p className="text-xs font-medium text-gray-500 mt-2 truncate">{m.asunto}</p>}
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{m.mensaje}</p>
              </div>
            ))}
        </div>

        {/* Detalle */}
        <div>
          {seleccionado ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: "#0A5D8F" }}>{seleccionado.nombre}</h2>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <a href={`mailto:${seleccionado.email}`} className="text-sm text-blue-500 hover:underline">{seleccionado.email}</a>
                    {seleccionado.telefono && <a href={`tel:${seleccionado.telefono}`} className="text-sm text-gray-400">{seleccionado.telefono}</a>}
                  </div>
                </div>
                <span className="text-xs text-gray-300">{new Date(seleccionado.created_at).toLocaleString("es-MX")}</span>
              </div>
              {seleccionado.asunto && (
                <p className="text-sm font-semibold text-gray-600 mb-3">Asunto: {seleccionado.asunto}</p>
              )}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {seleccionado.mensaje}
              </div>
              <div className="flex gap-3 mt-5">
                <a
                  href={`mailto:${seleccionado.email}?subject=Re: ${seleccionado.asunto || "Tu consulta en Alexa Tours"}`}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                  style={{ backgroundColor: "#0E84C7" }}
                >
                  📧 Responder por email
                </a>
                <button
                  onClick={() => eliminar(seleccionado.id)}
                  className="py-2.5 px-4 rounded-xl text-sm text-red-400 border border-red-200 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-300 shadow-sm">
              <p className="text-4xl mb-3">👈</p>
              <p>Selecciona un mensaje para leerlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
