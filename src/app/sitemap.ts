import type { MetadataRoute } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://alexatours.mx";

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [paquetes, destinos, articulos] = await Promise.all([
    fetchJson<{ id: number; updated_at?: string }>(`${API}/paquetes`),
    fetchJson<{ id: number; updated_at?: string }>(`${API}/destinos`),
    fetchJson<{ slug: string; publicado_en?: string; created_at?: string }>(`${API}/blog?limit=100`),
  ]);

  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/paquetes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/destinos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ofertas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/comparador`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/legal/privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/terminos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const paquetesMap: MetadataRoute.Sitemap = paquetes.map((p) => ({
    url: `${BASE}/paquetes/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const destinosMap: MetadataRoute.Sitemap = destinos.map((d) => ({
    url: `${BASE}/destinos/${d.id}`,
    lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogMap: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: a.publicado_en ? new Date(a.publicado_en) : new Date(a.created_at ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...estaticas, ...paquetesMap, ...destinosMap, ...blogMap];
}
