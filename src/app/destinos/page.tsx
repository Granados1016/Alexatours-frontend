import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Destinos de Viaje — Alexa Tours",
  description: "Descubre todos los destinos turísticos que Alexa Tours tiene para ti: Caribe, Europa, América, y más.",
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface Destino {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  imagen_url?: string;
  paises?: string;
}

interface Paquete {
  id: number;
  destino?: { id: number } | null;
}

async function getDestinos(): Promise<Destino[]> {
  try {
    const res = await fetch(`${API}/destinos`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getPaquetes(): Promise<Paquete[]> {
  try {
    const res = await fetch(`${API}/paquetes`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const REGION_MAP: Record<string, { emoji: string; color: string }> = {
  carib: { emoji: "🏖️", color: "#0E84C7" },
  playa: { emoji: "🏖️", color: "#0E84C7" },
  cancun: { emoji: "🏖️", color: "#0E84C7" },
  paris: { emoji: "🏰", color: "#6366F1" },
  europa: { emoji: "🏰", color: "#6366F1" },
  nueva: { emoji: "🗽", color: "#10B981" },
  mexico: { emoji: "🇲🇽", color: "#EF4444" },
  merida: { emoji: "🇲🇽", color: "#EF4444" },
  oaxaca: { emoji: "🇲🇽", color: "#EF4444" },
};

function getStyle(nombre: string): { emoji: string; color: string } {
  if (!nombre) return { emoji: "✈️", color: "#D9B96E" };
  const n = nombre.toLowerCase();
  for (const [key, val] of Object.entries(REGION_MAP)) {
    if (n.includes(key)) return val;
  }
  return { emoji: "✈️", color: "#D9B96E" };
}

export default async function DestinosPage() {
  const [destinos, paquetes] = await Promise.all([getDestinos(), getPaquetes()]);

  const conteoPorDestino: Record<number, number> = {};
  for (const p of paquetes) {
    const dId = p.destino?.id;
    if (typeof dId === "number") {
      conteoPorDestino[dId] = (conteoPorDestino[dId] ?? 0) + 1;
    }
  }

  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Explora el mundo
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
            Nuestros destinos
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Desde playas del Caribe hasta las capitales europeas — el destino perfecto para cada viajero.
          </p>
        </div>

        {destinos.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🌍</p>
            <p className="text-sm text-gray-400 mb-6">Pronto agregaremos destinos emocionantes</p>
            <Link href="/paquetes"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0E84C7" }}>
              Ver paquetes disponibles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {destinos.map((d) => {
              const imgSrc = d.imagenUrl ?? d.imagen_url ?? null;
              const numPaquetes = conteoPorDestino[d.id] ?? 0;
              const { emoji, color } = getStyle(d.nombre ?? "");

              return (
                <Link
                  key={d.id}
                  href={`/destinos/${d.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {imgSrc ? (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={d.nombre ?? "Destino"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-40 flex items-center justify-center text-5xl"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      {emoji}
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="font-heading font-bold text-base truncate" style={{ color: "#0A5D8F" }}>
                      {d.nombre ?? "Destino"}
                    </h2>
                    {d.descripcion && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{d.descripcion}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {numPaquetes} {numPaquetes === 1 ? "paquete" : "paquetes"}
                      </span>
                      <span className="text-xs font-medium group-hover:underline" style={{ color }}>
                        Ver →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-3xl mb-3">✈️</p>
          <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
            ¿No encuentras tu destino soñado?
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Creamos viajes a la medida. Cuéntanos a dónde quieres ir.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0E84C7" }}>
              Cotizar destino personalizado
            </Link>
            <Link href="/comparador"
              className="px-6 py-2.5 rounded-full text-sm font-semibold border-2"
              style={{ borderColor: "#0E84C7", color: "#0E84C7" }}>
              Comparar paquetes
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
