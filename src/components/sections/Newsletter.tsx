"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const suscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setEstado("loading");
    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setEstado("ok");
        setEmail("");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: "#0A5D8F" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
          Mantente informado
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
          Recibe ofertas y destinos exclusivos
        </h2>
        <p className="text-white/70 text-sm mb-8">
          Únete a nuestros viajeros y sé el primero en conocer nuevos paquetes, promociones y tips de viaje.
        </p>

        {estado === "ok" ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <span className="text-3xl">🎉</span>
            <p className="text-white font-semibold text-lg">
              ¡Gracias! Ya estás suscrito a nuestras novedades.
            </p>
          </div>
        ) : (
          <form onSubmit={suscribir} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none text-gray-800 focus:ring-2 focus:ring-[#D9B96E]"
            />
            <button
              type="submit"
              disabled={estado === "loading"}
              className="px-7 py-3 rounded-full text-sm font-bold text-[#0A5D8F] transition-all hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{ backgroundColor: "#D9B96E" }}
            >
              {estado === "loading" ? "Suscribiendo..." : "Suscribirme"}
            </button>
          </form>
        )}

        {estado === "error" && (
          <p className="text-red-300 text-sm mt-3">
            Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.
          </p>
        )}

        <p className="text-white/40 text-xs mt-4">
          Sin spam. Cancela cuando quieras.
        </p>
      </div>
    </section>
  );
}
