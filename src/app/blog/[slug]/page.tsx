import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://alexatours.mx";

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
  } catch { return null; }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArticulo(slug);
  if (!art) return { title: "Artículo no encontrado | Alexa Tours" };
  return {
    title: `${art.titulo} | Blog Alexa Tours`,
    description: art.meta_descripcion || art.resumen || art.titulo,
    openGraph: {
      title: art.titulo,
      description: art.meta_descripcion || art.resumen || "",
      images: art.imagen_portada ? [{ url: art.imagen_portada }] : [],
      type: "article",
      publishedTime: art.publicado_en || art.created_at,
    },
  };
}

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

/** Detecta si el contenido es HTML o Markdown/texto plano */
function esHTML(texto: string) {
  return texto.trimStart().startsWith("<");
}

export default async function ArticuloPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const articulo = await getArticulo(slug);
  if (!articulo) notFound();

  const url = `${SITE}/blog/${articulo.slug}`;
  const isHTML = esHTML(articulo.contenido);

  // Schema.org Article
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.meta_descripcion || articulo.resumen || "",
    image: articulo.imagen_portada || "",
    datePublished: articulo.publicado_en || articulo.created_at,
    author: { "@type": "Organization", name: "Alexa Tours" },
    publisher: { "@type": "Organization", name: "Alexa Tours", url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
        {/* Imagen portada */}
        {articulo.imagen_portada && (
          <div className="w-full h-72 md:h-[420px] overflow-hidden relative">
            <img
              src={articulo.imagen_portada}
              alt={articulo.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#E8F4FD", color: "#0A5D8F" }}>
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

          {/* Contenido — HTML o texto plano */}
          {isHTML ? (
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: articulo.contenido }}
            />
          ) : (
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {articulo.contenido}
            </div>
          )}

          {/* Tags */}
          {articulo.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-400 mb-2">Etiquetas:</p>
              <div className="flex flex-wrap gap-2">
                {articulo.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compartir */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-500 mb-3">Compartir artículo:</p>
            <ShareButtons url={url} titulo={articulo.titulo} />
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/blog"
              className="px-6 py-3 rounded-xl border text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              ← Volver al blog
            </Link>
            <Link href="/paquetes"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0E84C7" }}>
              Ver paquetes de viaje ✈️
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
