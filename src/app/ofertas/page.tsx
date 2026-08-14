import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ofertas y Promociones — Alexa Tours",
  description: "Aprovecha las mejores ofertas y descuentos en paquetes de viaje. Precios especiales por tiempo limitado.",
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionDias: number;
  imagenUrl: string;
  ofertaPrecio?: number;
  ofertaHasta?: string;
  destino?: { nombre: string };
}

async function getPaquetesEnOferta(): Promise<Paquete[]> {
  try {
    const res = await fetch(`${API}/paquetes`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const all: Paquete[] = await res.json();
    return all.filter(
      (p) => p.ofertaPrecio && Number(p.ofertaPrecio) > 0 && Number(p.ofertaPrecio) < Number(p.precio)
    );
  } catch {
    return [];
  }
}

function descuento(precio: number, oferta: number) {
  return Math.round(((precio - oferta) / precio) * 100);
}

function formatFecha(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function OfertasPage() {
  const paquetes = await getPaquetesEnOferta();

  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            🔥 Tiempo Limitado
          </p>
          <h1 className="font-heading text-4xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
            Ofertas y Promociones
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Precios especiales en paquetes seleccionados. ¡No dejes pasar estas oportunidades únicas!
          </p>
        </div>

        {paquetes.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">✈️</p>
            <h2 className="font-heading text-2xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
              Próximamente nuevas ofertas
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              En este momento no tenemos ofertas activas, pero suscríbete para ser el primero en enterarte.
            </p>
            <Link href="/paquetes"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0E84C7" }}>
              Ver todos los paquetes
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paquetes.map((p) => {
                const pct = descuento(Number(p.precio), Number(p.ofertaPrecio!));
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                    {/* Badge descuento */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full">
                        -{pct}%
                      </span>
                    </div>

                    {/* Imagen */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={p.imagenUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    <div className="p-5">
                      {p.destino && (
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#D9B96E" }}>
                          {p.destino.nombre}
                        </p>
                      )}
                      <h3 className="font-heading text-lg font-bold mb-2" style={{ color: "#0A5D8F" }}>
                        {p.nombre}
                      </h3>
                      {p.descripcion && (
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.descripcion}</p>
                      )}

                      {/* Precios */}
                      <div className="flex items-end gap-3 mb-1">
                        <span className="font-heading text-2xl font-bold" style={{ color: "#0E84C7" }}>
                          ${Number(p.ofertaPrecio).toLocaleString("es-MX")}
                        </span>
                        <span className="text-sm text-gray-400 line-through mb-0.5">
                          ${Number(p.precio).toLocaleString("es-MX")}
                        </span>
                        <span className="text-xs text-gray-400 mb-0.5">MXN</span>
                      </div>

                      {/* Vence */}
                      {p.ofertaHasta && (
                        <p className="text-xs text-red-500 mb-3">
                          ⏰ Oferta válida hasta: {formatFecha(p.ofertaHasta)}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Link href={`/paquetes/${p.id}`}
                          className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white text-center"
                          style={{ backgroundColor: "#0E84C7" }}>
                          Ver paquete
                        </Link>
                        <a
                          href={`https://wa.me/52995305412?text=${encodeURIComponent(`Hola! Me interesa la oferta del paquete *${p.nombre}* por $${Number(p.ofertaPrecio).toLocaleString("es-MX")} MXN. ¿Está disponible?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white"
                          style={{ backgroundColor: "#25D366" }}>
                          WA
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link href="/paquetes"
                className="px-8 py-3 rounded-full text-sm font-semibold border-2"
                style={{ borderColor: "#0E84C7", color: "#0E84C7" }}>
                Ver todos los paquetes →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
