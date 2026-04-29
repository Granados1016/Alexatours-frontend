import Link from "next/link";
import type { SiteConfig } from "@/lib/configuracion";

interface FooterProps {
  config: SiteConfig;
  waUrl: string;
}

export default function Footer({ config, waUrl }: FooterProps) {
  return (
    <footer style={{ backgroundColor: "#0A5D8F" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <p className="font-heading text-2xl font-bold mb-2">
              <span className="text-white">{config.nombre_empresa.split(" ")[0]}</span>
              <span style={{ color: "#D9B96E" }}> {config.nombre_empresa.split(" ").slice(1).join(" ")}</span>
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{config.slogan}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#D9B96E" }}>
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {[
                { href: "/#destinos", label: "Destinos" },
                { href: "/#paquetes", label: "Paquetes" },
                { href: "/#nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#D9B96E" }}>
              Contáctanos
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {config.direccion && <li>📍 {config.direccion}</li>}
              {config.telefono_display && <li>📱 {config.telefono_display}</li>}
              {config.email_contacto && (
                <li>
                  <a
                    href={`mailto:${config.email_contacto}`}
                    className="hover:text-white transition-colors"
                  >
                    ✉️ {config.email_contacto}
                  </a>
                </li>
              )}
            </ul>
            <div className="flex gap-3 mt-4 flex-wrap">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full font-medium bg-green-500 text-white hover:bg-green-400 transition-colors"
              >
                WhatsApp
              </a>
              {config.instagram_url && (
                <a
                  href={config.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full font-medium text-white border border-white/40 hover:border-white transition-colors"
                >
                  Instagram
                </a>
              )}
              {config.facebook_url && (
                <a
                  href={config.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full font-medium text-white border border-white/40 hover:border-white transition-colors"
                >
                  Facebook
                </a>
              )}
              {config.tiktok_url && (
                <a
                  href={config.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full font-medium text-white border border-white/40 hover:border-white transition-colors"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {config.nombre_empresa}. Todos los derechos reservados. — {config.slogan} 🌴
        </div>
      </div>
    </footer>
  );
}
