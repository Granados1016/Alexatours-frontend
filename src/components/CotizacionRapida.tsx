"use client";

import { useState } from "react";

interface Props {
  paqueteNombre: string;
  precio: number;
  waNumero: string;
}

export default function CotizacionRapida({ paqueteNombre, precio, waNumero }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", personas: "2", fechaViaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleWA = () => {
    const total = precio * Number(form.personas);
    const msg = [
      `Hola! 👋 Quiero cotizar el paquete *${paqueteNombre}*.`,
      ``,
      `📋 Mis datos:`,
      `• Nombre: ${form.nombre}`,
      `• Personas: ${form.personas}`,
      form.fechaViaje ? `• Fecha estimada: ${form.fechaViaje}` : "",
      ``,
      `💰 Precio estimado: $${total.toLocaleString("es-MX")} MXN (${form.personas} personas × $${precio.toLocaleString("es-MX")})`,
      ``,
      `¿Pueden confirmar disponibilidad? ¡Gracias!`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${waNumero}?text=${encodeURIComponent(msg)}`, "_blank");
    setEnviado(true);
  };

  const handleContacto = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const total = precio * Number(form.personas);
    try {
      await fetch(`${API}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          asunto: `Cotización rápida: ${paqueteNombre}`,
          mensaje: `Interesado en ${paqueteNombre} para ${form.personas} personas${form.fechaViaje ? ` el ${form.fechaViaje}` : ""}. Precio estimado: $${total.toLocaleString("es-MX")} MXN.`,
        }),
      });
    } catch { /* ignore */ }
    setEnviado(true);
  };

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="w-full py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:opacity-80 mt-2"
        style={{ borderColor: "#D9B96E", color: "#B45309" }}
      >
        🗓 Cotización rápida
      </button>
    );
  }

  return (
    <div className="mt-2 p-4 rounded-2xl border border-amber-100" style={{ backgroundColor: "#FFFBF0" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: "#B45309" }}>🗓 Cotización rápida</p>
        <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>

      {enviado ? (
        <div className="text-center py-3">
          <p className="text-2xl mb-1">✅</p>
          <p className="text-sm font-medium text-green-700">¡Cotización enviada!</p>
          <p className="text-xs text-gray-400 mt-1">Te contactaremos pronto</p>
          <button onClick={() => { setEnviado(false); setAbierto(false); }}
            className="text-xs text-blue-500 underline mt-2">Cerrar</button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Tu nombre *"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm outline-none focus:border-amber-400 bg-white"
          />
          <input
            type="tel"
            placeholder="WhatsApp / teléfono"
            value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm outline-none focus:border-amber-400 bg-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Personas</label>
              <select
                value={form.personas}
                onChange={(e) => setForm((f) => ({ ...f, personas: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm bg-white outline-none"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Fecha aprox.</label>
              <input
                type="month"
                value={form.fechaViaje}
                onChange={(e) => setForm((f) => ({ ...f, fechaViaje: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm bg-white outline-none"
              />
            </div>
          </div>

          {/* Precio estimado */}
          {Number(form.personas) > 0 && (
            <div className="text-center py-2 rounded-xl" style={{ backgroundColor: "#FEF3C7" }}>
              <p className="text-xs text-amber-600">Precio estimado:</p>
              <p className="font-heading text-lg font-bold" style={{ color: "#B45309" }}>
                ${(precio * Number(form.personas)).toLocaleString("es-MX")} MXN
              </p>
              <p className="text-xs text-amber-500">{form.personas} persona{Number(form.personas) !== 1 ? "s" : ""} × ${precio.toLocaleString("es-MX")}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWA}
              disabled={!form.nombre.trim()}
              className="py-2.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#25D366" }}
            >
              📱 WhatsApp
            </button>
            <button
              onClick={handleContacto}
              disabled={!form.nombre.trim()}
              className="py-2.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#0E84C7" }}
            >
              ✉️ Formulario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
