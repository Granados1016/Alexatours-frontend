import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexatours.mx'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  // Paquetes dinámicos
  let paquetePages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/paquetes`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const paquetes = await res.json()
      paquetePages = paquetes.map((p: any) => ({
        url: `${base}/paquetes/${p.id}`,
        lastModified: new Date(p.updated_at || p.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {}

  // Artículos de blog dinámicos
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/blog`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      const articulos = data.data || data
      blogPages = articulos.map((a: any) => ({
        url: `${base}/blog/${a.slug}`,
        lastModified: new Date(a.updated_at || a.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch {}

  return [...staticPages, ...paquetePages, ...blogPages]
}
