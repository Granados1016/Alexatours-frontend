import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Articulo {
  id: number;
  slug: string;
  titulo: string;
  contenido: string;
  resumen: string;
  imagen_portada: string;
  categoria: string;
  tags: string[];
  meta_descripcion: string;
  publicado_en: string;
  created_at: string;
}

async function getArticulo(slug: string): Promise<Articulo | null> {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await getArticulo(slug);
  if (!articulo) return { title: "Artículo no encontrado | Alexa Tours" };

  return {
    title: `${articulo.titulo} | Blog Alexa Tours`,
    description: articulo.meta_descripcion || articulo.resumen || articulo.titulo,
    openGraph: {
      title: articulo.titulo,
      description: articulo.meta_descripcion || articulo.resumen || "",
      images: articulo.imagen_portada ? [{ url: articulo.imagen_portada }] : [],
      type: "article",
      publishedTime: articulo.publicado_en || articulo.created_at,
    },
  };
}

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ArticuloPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const articulo = await getArticulo(slug);
  if (!articulo) notFound();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      {/* Imagen portada */}
      {articulo.imagen_portada && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img
            src={articulo.imagen_portada}
            alt={articulo.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Inicio</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <span>›</span>
          <span className="text-gray-600 truncate">{articulo.titulo}</span>
        </nav>

        {/* Categoría + fecha */}
        <div className="flex items-center gap-3 mb-4">
          {articulo.categoria && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#E8F4FD", color: "#0A5D8F" }}
            >
              {articulo.categoria}
            </span>
          )}
          <span className="text-sm text-gray-400">
            {formatFecha(articulo.publicado_en || articulo.created_at)}
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#0A5D8F" }}>
          {articulo.titulo}
        </h1>

        {/* Resumen */}
        {articulo.resumen && (
          <p className="text-lg text-gray-600 mb-8 font-medium border-l-4 pl-4"
            style={{ borderColor: "#D9B96E" }}>
            {articulo.resumen}
          </p>
        )}

        {/* Contenido */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {articulo.contenido}
        </div>

        {/* Tags */}
        {articulo.tags && articulo.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-400 mb-2">Etiquetas:</p>
            <div className="flex flex-wrap gap-2">
              {articulo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA volver */}
        <div className="mt-12 flex items-center gap-4">
          <Link
            href="/blog"
            className="px-6 py-3 rounded-xl border text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            ← Volver al blog
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0E84C7" }}
          >
            Ver paquetes de viaje
          </Link>
        </div>
      </article>
    </main>
  );
}
