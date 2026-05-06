import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros | Alexa Tours — Agencia de Viajes en México",
  description:
    "Conoce la historia, valores y el equipo detrás de Alexa Tours. Más de 10 años creando experiencias de viaje únicas e inolvidables por México y el mundo.",
  openGraph: {
    title: "Nosotros | Alexa Tours",
    description:
      "Conoce la historia, valores y el equipo detrás de Alexa Tours. Más de 10 años creando experiencias de viaje únicas.",
    type: "website",
  },
};

const valores = [
  {
    icono: "🏆",
    titulo: "Experiencia",
    descripcion:
      "Más de 10 años organizando viajes por México y el mundo. Cada itinerario está respaldado por un profundo conocimiento de los destinos y sus secretos mejor guardados.",
  },
  {
    icono: "🤝",
    titulo: "Confianza",
    descripcion:
      "Trabajamos con proveedores certificados y hoteles de calidad comprobada. Tu tranquilidad es nuestra prioridad antes, durante y después de cada viaje.",
  },
  {
    icono: "✨",
    titulo: "Personalización",
    descripcion:
      "No creemos en los viajes de talla única. Diseñamos cada experiencia a la medida de tus sueños, presupuesto y preferencias personales.",
  },
  {
    icono: "❤️",
    titulo: "Pasión por viajar",
    descripcion:
      "El equipo de Alexa Tours está formado por viajeros apasionados que viven y respiran turismo. Esa pasión se traduce en recomendaciones auténticas y memorables.",
  },
];

const equipo = [
  {
    nombre: "Alejandra Mendoza",
    cargo: "Fundadora & Directora General",
    foto: null,
    iniciales: "AM",
    bio: "Con más de 15 años de experiencia en turismo, Ale fundó Alexa Tours con el sueño de hacer accesibles los mejores destinos de México.",
  },
  {
    nombre: "Carlos Ortiz",
    cargo: "Especialista en Destinos de Playa",
    foto: null,
    iniciales: "CO",
    bio: "Experto en el Caribe mexicano y las costas del Pacífico. Ha diseñado más de 300 itinerarios a Cancún, Los Cabos y la Riviera Nayarit.",
  },
  {
    nombre: "Sofía Reyes",
    cargo: "Coordinadora de Grupos y Bodas",
    foto: null,
    iniciales: "SR",
    bio: "Especialista en viajes grupales y luna de miel. Sofía se encarga de que cada detalle sea perfecto para las celebraciones más especiales.",
  },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>

      {/* ─── HERO ─── */}
      <section className="py-24 text-center" style={{ backgroundColor: "#0A5D8F" }}>
        {/* Patrón decorativo */}
        <div
          className="absolute top-20 left-10 w-40 h-40 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #D9B96E 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />
        <p
          className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          style={{ color: "#D9B96E" }}
        >
          Agencia de Viajes · México
        </p>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Sobre <span style={{ color: "#D9B96E" }}>Nosotros</span>
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Más de 10 años conectando viajeros mexicanos con los destinos más increíbles del mundo
        </p>
      </section>

      {/* ─── HISTORIA ─── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#0E84C7" }}
            >
              Nuestra Historia
            </span>
            <h2
              className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-6"
              style={{ color: "#0A5D8F" }}
            >
              Nacimos del amor por México y el mundo
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                En 2013, Alejandra Mendoza renunció a su trabajo de oficina con una maleta,
                mucha determinación y un sueño claro: crear una agencia de viajes diferente,
                donde cada cliente fuera tratado como familia y cada itinerario fuera diseñado
                con alma.
              </p>
              <p>
                Desde su pequeña oficina en la Ciudad de México, Alexa Tours comenzó
                organizando escapadas de fin de semana a Oaxaca, Puebla y la Riviera Maya.
                La calidad del servicio y la atención al detalle hicieron el resto: el boca
                a boca convirtió a una pequeña agencia local en un referente del turismo
                personalizado en México.
              </p>
              <p>
                Hoy, con un equipo de especialistas apasionados, hemos acompañado a más de
                500 familias, parejas y grupos de amigos en aventuras por los cinco continentes.
                Cada viaje que organizamos lleva la misma esencia con que comenzamos: pasión,
                honestidad y la promesa de que tu experiencia será inolvidable.
              </p>
            </div>
          </div>

          {/* Estadísticas visuales */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { numero: "10+", etiqueta: "Años de experiencia" },
              { numero: "500+", etiqueta: "Viajeros felices" },
              { numero: "30+", etiqueta: "Destinos disponibles" },
              { numero: "5 ★", etiqueta: "Calificación promedio" },
            ].map((stat) => (
              <div
                key={stat.etiqueta}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #E8F4FD" }}
              >
                <p
                  className="font-heading text-4xl font-bold mb-1"
                  style={{ color: "#0E84C7" }}
                >
                  {stat.numero}
                </p>
                <p className="text-sm text-gray-500">{stat.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALORES ─── */}
      <section
        className="py-20"
        style={{ backgroundColor: "#0A5D8F" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#D9B96E" }}
            >
              Lo que nos define
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2">
              Nuestros Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="rounded-2xl p-6 flex flex-col items-center text-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <span className="text-4xl mb-4">{v.icono}</span>
                <h3
                  className="font-heading text-lg font-bold mb-2"
                  style={{ color: "#D9B96E" }}
                >
                  {v.titulo}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{v.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUIPO ─── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#0E84C7" }}
          >
            Las personas detrás de tu viaje
          </span>
          <h2
            className="font-heading text-3xl md:text-4xl font-bold mt-2"
            style={{ color: "#0A5D8F" }}
          >
            Nuestro Equipo
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipo.map((persona) => (
            <div
              key={persona.nombre}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar placeholder */}
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #0A5D8F 0%, #0E84C7 100%)",
                }}
              >
                {persona.iniciales}
              </div>
              <h3
                className="font-heading text-lg font-bold mb-1"
                style={{ color: "#0A5D8F" }}
              >
                {persona.nombre}
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#D9B96E" }}
              >
                {persona.cargo}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">{persona.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section
        className="py-20 text-center"
        style={{ backgroundColor: "#F8F3E8", borderTop: "1px solid #e5ddd0" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2
            className="font-heading text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#0A5D8F" }}
          >
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Platícanos tu sueño de viaje y nuestro equipo diseñará una experiencia
            a la medida, sin costos adicionales de asesoría.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-10 py-4 rounded-full text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "#0E84C7" }}
          >
            ✈️ Cotiza tu viaje
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Respuesta en menos de 24 horas · Sin compromiso
          </p>
        </div>
      </section>
    </main>
  );
}
