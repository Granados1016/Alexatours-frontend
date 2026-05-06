import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog de Viajes | Alexa Tours",
  description: "Descubre consejos, guías de destinos y tendencias de viaje. Inspírate con nuestros artículos y planifica tu próxima aventura con Alexa Tours.",
  openGraph: {
    title: "Blog de Viajes | Alexa Tours",
    description: "Consejos, guías y tendencias de viaje para inspirarte.",
    type: "website",
  },
};

interface Articulo {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  imagen_portada: string;
  categoria: string;
  tags: string[];
  publicado_en: string;
  created_at: string;
}

interface BlogResponse {
  data: Articulo[];
  total: number;
  page: number;
  limit: number;
}

async function getArticulos(): Promise<Articulo[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/blog?limit=20`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json: BlogResponse | Articulo[] = await res.json();
    return Array.isArray(json) ? json : json.data ?? [];
  } catch {
    return [];
  }
}

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPage() {
  const articulos = await getArticulos();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      {/* Hero */}
      <section className="py-20 text-center" style={{ backgroundColor: "#0A5D8F" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Blog de <span style={{ color: "#D9B96E" }}>Viajes</span>
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Guías, consejos e inspiración para tu próxima aventura
        </p>
      </section>

      {/* Artículos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {articulos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-xl">Próximamente publicaremos artículos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  {/* Imagen */}
                  <div className="h-48 overflow-hidden">
                    {a.imagen_portada ? (
                      <img
                        src={a.imagen_portada}
                        alt={a.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ backgroundColor: "#E8F4FD" }}
                      >
                        ✈️
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    {a.categoria && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start"
                        style={{ backgroundColor: "#E8F4FD", color: "#0A5D8F" }}
                      >
                        {a.categoria}
                      </span>
                    )}
                    <h2
                      className="font-bold text-lg mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity"
                      style={{ color: "#0A5D8F" }}
                    >
                      {a.titulo}
                    </h2>
                    {a.resumen && (
                      <p className="text-gray-500 text-sm line-clamp-3 flex-1">{a.resumen}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatFecha(a.publicado_en || a.created_at)}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "#0E84C7" }}>
                        Leer más →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
