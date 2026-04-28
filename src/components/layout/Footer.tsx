import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A5D8F" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <p className="font-heading text-2xl font-bold mb-2">
              <span className="text-white">Alexa</span>
              <span style={{ color: "#D9B96E" }}> Tours</span>
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Viajes para recordar. Agencia de viajes con salidas desde Campeche
              y el sureste de México.
            </p>
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
              <li>📍 Campeche, México</li>
              <li>📱 +52 999 123 4567</li>
              <li>✉️ hola@alexatours.mx</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="https://wa.me/529991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full font-medium bg-green-500 text-white hover:bg-green-400 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/alexatours"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full font-medium text-white border border-white/40 hover:border-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Alexa Tours. Todos los derechos reservados. — Viajes para recordar 🌴
        </div>
      </div>
    </footer>
  );
}
