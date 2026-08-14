import type { Metadata } from "next";
import BlogCliente from "./BlogCliente";

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

async function getArticulos(): Promise<Articulo[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/blog?limit=100`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const articulos = await getArticulos();
  return <BlogCliente articulos={articulos} />;
}
