/**
 * Server-side helper — fetches all site settings from the backend.
 * Revalidates every 60 seconds (ISR-like behaviour in App Router).
 * Falls back to safe defaults so the site never breaks even if the API is down.
 */

export interface SiteConfig {
  whatsapp_numero: string;
  telefono_display: string;
  email_contacto: string;
  direccion: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  hero_titulo: string;
  hero_subtitulo: string;
  hero_cta_texto: string;
  hero_imagen_url: string;
  nombre_empresa: string;
  slogan: string;
  cta_whatsapp_msg: string;
  [key: string]: string;
}

const DEFAULTS: SiteConfig = {
  whatsapp_numero:  "529991234567",
  telefono_display: "+52 (999) 123-4567",
  email_contacto:   "info@alexatours.mx",
  direccion:        "Mérida, Yucatán, México",
  instagram_url:    "https://instagram.com/alexatours",
  facebook_url:     "https://facebook.com/alexatours",
  tiktok_url:       "https://tiktok.com/@alexatours",
  hero_titulo:      "Descubre el Mundo con Alexa Tours",
  hero_subtitulo:   "Experiencias únicas, recuerdos para siempre. Viaja con los expertos.",
  hero_cta_texto:   "Ver Paquetes",
  hero_imagen_url:  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600",
  nombre_empresa:   "Alexa Tours",
  slogan:           "Tu agencia de viajes de confianza",
  cta_whatsapp_msg: "Hola! Me interesa conocer más sobre sus paquetes de viaje.",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const res = await fetch(`${apiUrl}/configuracion`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: Record<string, string> = await res.json();
    return { ...DEFAULTS, ...data };
  } catch {
    // API down or error — return defaults so the landing always renders
    return DEFAULTS;
  }
}

/** Build WhatsApp deep-link URL from stored number + message */
export function waUrl(config: SiteConfig): string {
  const num = config.whatsapp_numero.replace(/\D/g, "");
  const msg = encodeURIComponent(config.cta_whatsapp_msg);
  return `https://wa.me/${num}?text=${msg}`;
}
