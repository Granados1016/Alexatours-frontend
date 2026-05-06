import { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/configuracion'
import { notFound } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Paquete {
  id: number
  nombre: string
  descripcion: string
  precio: number
  dias: number
  imagen_url?: string
  destino?: string
  incluye?: string[] | string
  destacado?: boolean
  created_at?: string
  updated_at?: string
}

async function getPaquete(id: string): Promise<Paquete | null> {
  try {
    const res = await fetch(`${API_URL}/paquetes/${id}`, {
      next: { revalidate: 3600 },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    return null
  }
}

function parseIncluye(incluye: string[] | string | undefined): string[] {
  if (!incluye) return []
  if (Array.isArray(incluye)) return incluye
  // Puede venir como JSON string o separado por comas
  try {
    const parsed = JSON.parse(incluye)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return incluye.split(',').map((s) => s.trim()).filter(Boolean)
}

// ── SEO dinámico ────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const paquete = await getPaquete(params.id)

  if (!paquete) {
    return {
      title: 'Paquete no encontrado — Alexa Tours',
      description: 'El paquete que buscas no existe o ya no está disponible.',
    }
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexatours.mx'
  const title = `${paquete.nombre} — Alexa Tours`
  const description =
    paquete.descripcion
      ? paquete.descripcion.slice(0, 160)
      : `Paquete ${paquete.nombre} desde $${paquete.precio?.toLocaleString('es-MX')} MXN. ${paquete.dias} días. Reserva con Alexa Tours.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${base}/paquetes/${paquete.id}`,
      images: paquete.imagen_url
        ? [{ url: paquete.imagen_url, width: 1200, height: 630, alt: paquete.nombre }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: paquete.imagen_url ? [paquete.imagen_url] : [],
    },
    alternates: {
      canonical: `${base}/paquetes/${paquete.id}`,
    },
  }
}

// ── Página ───────────────────────────────────────────────────────────────────

export default async function PaquetePage({ params }: { params: { id: string } }) {
  const [paquete, config] = await Promise.all([
    getPaquete(params.id),
    getSiteConfig(),
  ])

  if (!paquete) {
    notFound()
  }

  const incluye = parseIncluye(paquete.incluye)

  const waNumero = config.whatsapp_numero.replace(/\D/g, '')
  const waMsg = encodeURIComponent(`Hola, me interesa el paquete: ${paquete.nombre}`)
  const waHref = `https://wa.me/${waNumero}?text=${waMsg}`

  const imagenSrc =
    paquete.imagen_url ||
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: '#F8F3E8' }}>
      {/* Hero imagen */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden">
        <img
          src={imagenSrc}
          alt={paquete.nombre}
          className="w-full h-full object-cover"
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Botón volver sobre la imagen */}
        <div className="absolute top-5 left-4 sm:left-8">
          <Link
            href="/#paquetes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm shadow transition-all hover:bg-white"
            style={{ color: '#0A5D8F' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>

        {/* Nombre del paquete sobre la imagen */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8">
          {paquete.destino && (
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-white/80">
              {paquete.destino}
            </p>
          )}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
            {paquete.nombre}
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna izquierda: descripción + incluye */}
          <div className="lg:col-span-2 space-y-8">

            {/* Descripción */}
            {paquete.descripcion && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold mb-4" style={{ color: '#0A5D8F' }}>
                  Descripción del paquete
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#444444' }}>
                  {paquete.descripcion}
                </p>
              </div>
            )}

            {/* Lo que incluye */}
            {incluye.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold mb-4" style={{ color: '#0A5D8F' }}>
                  ¿Qué incluye?
                </h2>
                <ul className="space-y-3">
                  {incluye.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: '#444444' }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: '#D9B96E' }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Columna derecha: precio + CTA */}
          <div className="space-y-4">
            {/* Tarjeta de precio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
              {/* Precio */}
              <div className="text-center mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Precio por persona</p>
                <p className="font-heading text-4xl font-bold" style={{ color: '#0E84C7' }}>
                  ${paquete.precio?.toLocaleString('es-MX')}
                </p>
                <p className="text-xs text-gray-400 mt-1">MXN</p>
              </div>

              {/* Duración */}
              {paquete.dias && (
                <div
                  className="flex items-center justify-center gap-2 py-3 mb-5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#F8F3E8', color: '#444444' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: '#D9B96E' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    <strong>{paquete.dias}</strong> {paquete.dias === 1 ? 'día' : 'días'}
                  </span>
                </div>
              )}

              {/* Botón WhatsApp */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md mb-3"
                style={{ backgroundColor: '#25D366' }}
              >
                {/* WhatsApp icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.526 5.854L.057 23.57a.75.75 0 00.921.921l5.716-1.469A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.987-1.373l-.357-.212-3.706.952.969-3.637-.232-.375A9.699 9.699 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Cotizar por WhatsApp
              </a>

              {/* Botón secundario contacto */}
              <Link
                href="/contacto"
                className="flex items-center justify-center w-full py-3 rounded-full text-sm font-semibold border-2 transition-all hover:opacity-80"
                style={{ borderColor: '#0E84C7', color: '#0E84C7' }}
              >
                Solicitar cotización
              </Link>

              <p className="text-xs text-center text-gray-400 mt-4">
                Atención personalizada desde Campeche
              </p>
            </div>
          </div>

        </div>

        {/* Nota inferior */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            ¿Tienes dudas?{' '}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: '#0E84C7' }}
            >
              Escríbenos por WhatsApp
            </a>{' '}
            y te ayudamos a planear tu viaje ideal.
          </p>
        </div>
      </div>
    </div>
  )
}
