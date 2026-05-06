"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Props {
  paqueteId: number;
  paqueteNombre: string;
  precio: number;
  isOpen: boolean;
  onClose: () => void;
}

type Paso = "form" | "exito";

export default function ReservaModal({
  paqueteId,
  paqueteNombre,
  precio,
  isOpen,
  onClose,
}: Props) {
  const [paso, setPaso] = useState<Paso>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hoy = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaViaje: "",
    numPersonas: 1,
    notas: "",
  });

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPaso("form");
        setError("");
        setForm({ nombre: "", email: "", telefono: "", fechaViaje: "", numPersonas: 1, notas: "" });
      }, 300);
    }
  }, [isOpen]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const precioTotal = precio * form.numPersonas;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "numPersonas" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || undefined,
          paqueteId,
          paqueteNombre,
          fechaViaje: form.fechaViaje,
          numPersonas: form.numPersonas,
          notas: form.notas || undefined,
          precioTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }

      setPaso("exito");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const waMsg = encodeURIComponent(
    `Hola! Acabo de reservar el paquete "${paqueteNombre}" para ${form.numPersonas} persona${form.numPersonas > 1 ? "s" : ""} el ${form.fechaViaje}. Mi nombre es ${form.nombre}.`
  );
  const waHref = `https://wa.me/52${(form.telefono || "9811234567").replace(/\D/g, "")}?text=${waMsg}`;
  const waHrefGeneral = `https://wa.me/52?text=${waMsg}`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 rounded-t-2xl"
          style={{ backgroundColor: "#0A5D8F" }}
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Reservar paquete</h2>
            <p className="text-xs text-white/70 mt-0.5 truncate max-w-xs">{paqueteNombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors ml-4 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          {paso === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez García"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="9811234567"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
                />
              </div>

              {/* Fecha + Personas — fila */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Fecha de viaje <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fechaViaje"
                    type="date"
                    required
                    min={hoy}
                    value={form.fechaViaje}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Personas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="numPersonas"
                    value={form.numPersonas}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  name="notas"
                  rows={3}
                  value={form.notas}
                  onChange={handleChange}
                  placeholder="Preferencias, requerimientos especiales, preguntas..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors resize-none"
                />
              </div>

              {/* Precio estimado */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#F8F3E8" }}
              >
                <span className="text-sm text-gray-500">Precio estimado total</span>
                <span className="font-heading text-lg font-bold" style={{ color: "#0E84C7" }}>
                  ${precioTotal.toLocaleString("es-MX")} MXN
                </span>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0A5D8F" }}
              >
                {loading ? "Enviando reserva..." : "Confirmar reserva"}
              </button>

              <p className="text-xs text-center text-gray-400">
                Nuestro equipo confirmará tu reserva en menos de 24 h.
              </p>
            </form>
          ) : (
            /* ── Pantalla de éxito ── */
            <div className="text-center py-4 space-y-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
                style={{ backgroundColor: "#F0FAF4" }}
              >
                ✅
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold mb-1" style={{ color: "#0A5D8F" }}>
                  ¡Reserva recibida!
                </h3>
                <p className="text-sm text-gray-500">
                  Hola <strong>{form.nombre}</strong>, hemos recibido tu solicitud para{" "}
                  <strong>{paqueteNombre}</strong>. Te contactaremos pronto al correo{" "}
                  <strong>{form.email}</strong>.
                </p>
              </div>

              <a
                href={waHrefGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.526 5.854L.057 23.57a.75.75 0 00.921.921l5.716-1.469A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.987-1.373l-.357-.212-3.706.952.969-3.637-.232-.375A9.699 9.699 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Contactar por WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-full text-sm font-semibold border-2 transition-all hover:opacity-80"
                style={{ borderColor: "#0E84C7", color: "#0E84C7" }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
