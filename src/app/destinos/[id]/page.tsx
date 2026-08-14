import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/configuracion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Destino {
  id: number;
  nombre: string;
  pais?: string;
  descripcion?: string;
  imagen_url?: string;
  imagenUrl?: string;
}

interface Paquete {
  id: number;
  nombre: string;
  precio: number;
  duracionDias?: number;
  duracion_dias?: number;
  imagenUrl?: string;
  imagen_url?: string;
  incluye?: string[] | string;
  destacado?: boolean;
  activo?: boolean;
  destino?: { id: number; nombre?: string } | null;
}

async function getDestino(id: string): Promise<Destino | null> {
  try {
    const res = await fetch(`${API_URL}/destinos/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getPaquetesDestino(destinoId: number): Promise<Paquete[]> {
  try {
    const res = await fetch(`${API_URL}/paquetes`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const arr: Paquete[] = Array.isArray(data) ? data : (data.data ?? []);
    // El backend devuelve destino como objeto { id, nombre }
    return arr.filter((p) => {
      if (p.activo === false) return false;
      if (p.destino?.id === destinoId) return true;
      return false;
    });
  } catch {
    return [];
  }
}

function parseIncluye(inc: string[] | string | undefined): string[] {
  if (!inc) return [];
  if (Array.isArray(inc)) return inc;
  try { const p = JSON.parse(inc); if (Array.isArray(p)) return p; } catch {}
  return inc.split(",").map((s) => s.trim()).filter(Boolean);
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const destino = await getDestino(id);
  if (!destino) return { title: "Destino no encontrado — Alexa Tours" };
  const nombre = destino.nombre ?? "Destino";
  const pais = destino.pais ?? "";
  return {
    title: `${nombre}${pais ? `, ${pais}` : ""} — Alexa Tours`,
    description:
      destino.descripcion?.slice(0, 160) ||
      `Viaja a ${nombre} con Alexa Tours. Paquetes personalizados con todo incluido.`,
    openGraph: {
      title: `${nombre} — Alexa Tours`,
      images: (destino.imagen_url || destino.imagenUrl)
        ? [{ url: destino.imagen_url ?? destino.imagenUrl! }]
        : [],
    },
  };
}

// ── Página ────────────────────────────────────────────────────────────────────
export default async function DestinoPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [destino, config] = await Promise.all([getDestino(id), getSiteConfig()]);
  if (!destino) notFound();

  const paquetes = await getPaquetesDestino(destino.id);
  const waNumero = config.whatsapp_numero.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hola! 👋 Me interesa viajar a *${destino.nombre}*. ¿Qué paquetes tienen disponibles? ¡Gracias!`
  );
  const waHref = `https://wa.me/${waNumero}?text=${waMsg}`;
  const imagen =
    destino.imagen_url || destino.imagenUrl ||
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80";

  // Schema.org
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://alexatours.mx";
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destino.nombre,
    description: destino.descripcion || `Destino: ${destino.nombre}`,
    image: imagen,
    url: `${base}/destinos/${destino.id}`,
    ...(destino.pais && { containedInPlace: { "@type": "Country", name: destino.pais } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="pt-16 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
        {/* Hero */}
        <div className="relative h-80 sm:h-[420px] overflow-hidden">
          <img src={imagen} alt={destino.nombre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-5 left-4 sm:left-8">
            <Link
              href="/destinos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm shadow"
              style={{ color: "#0A5D8F" }}
            >
              ← Destinos
            </Link>
          </div>

          <div className="absolute bottom-8 left-4 sm:left-8">
            {destino.pais && (
              <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">
                {destino.pais}
              </p>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
              {destino.nombre}
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Descripción + Paquetes */}
            <div className="lg:col-span-2 space-y-8">
              {destino.descripcion && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-heading text-xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
                    Sobre {destino.nombre}
                  </h2>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#444" }}>
                    {destino.descripcion}
                  </p>
                </div>
              )}

              <div>
                <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: "#0A5D8F" }}>
                  Paquetes a {destino.nombre}
                </h2>
                {paquetes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <p className="text-4xl mb-3">✈️</p>
                    <p className="text-gray-400 mb-4">Próximamente paquetes a este destino</p>
                    <a
                      href={waHref} target="_blank" rel="noopener noreferrer"
                      className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      Cotizar por WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {paquetes.map((p) => {
                      const incluye = parseIncluye(p.incluye);
                      const imgP = p.imagenUrl || p.imagen_url || imagen;
                      const dias = p.duracionDias ?? p.duracion_dias ?? 0;
                      return (
                        <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                          <div className="h-40 overflow-hidden">
                            <img src={imgP} alt={p.nombre}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-5">
                            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: "#0A5D8F" }}>
                              {p.nombre}
                            </h3>
                            {incluye.length > 0 && (
                              <ul className="space-y-1 mb-4">
                                {incluye.slice(0, 3).map((item) => (
                                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "#444" }}>
                                    <span style={{ color: "#D9B96E" }}>✓</span>{item}
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                {dias > 0 && <p className="text-xs text-gray-400">{dias} días</p>}
                                <p className="font-heading text-xl font-bold" style={{ color: "#0E84C7" }}>
                                  ${Number(p.precio).toLocaleString("es-MX")}
                                </p>
                              </div>
                              <Link href={`/paquetes/${p.id}`}
                                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: "#0E84C7" }}>
                                Ver más
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20 text-center">
                <p className="font-heading text-lg font-bold mb-2" style={{ color: "#0A5D8F" }}>
                  ¿Listo para viajar?
                </p>
                <p className="text-sm text-gray-400 mb-5">
                  Cotiza tu viaje a {destino.nombre} con atención personalizada.
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white mb-3"
                  style={{ backgroundColor: "#25D366" }}>
                  💬 Cotizar por WhatsApp
                </a>
                <Link href="/contacto"
                  className="flex items-center justify-center w-full py-3 rounded-full text-sm font-semibold border-2"
                  style={{ borderColor: "#0E84C7", color: "#0E84C7" }}>
                  Solicitar información
                </Link>
                <Link href="/paquetes"
                  className="flex items-center justify-center w-full py-3 mt-2 rounded-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  Ver todos los paquetes →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
