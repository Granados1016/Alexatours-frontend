const razones = [
  {
    icon: "🎯",
    titulo: "Atención Personalizada",
    desc: "Cada viaje es único. Te asesoramos desde la cotización hasta tu regreso, con dedicación total.",
  },
  {
    icon: "🛡️",
    titulo: "Viajes Seguros",
    desc: "Trabajamos con aerolíneas y hoteles certificados. Tu seguridad y tranquilidad es nuestra prioridad.",
  },
  {
    icon: "💰",
    titulo: "Mejor Precio",
    desc: "Acceso a tarifas preferenciales y paquetes exclusivos. Más viaje por tu dinero.",
  },
  {
    icon: "🌍",
    titulo: "Amplia Experiencia",
    desc: "Años organizando viajes desde el sureste de México. Conocemos cada destino como si fuera nuestro.",
  },
];

export default function PorQueNosotros() {
  return (
    <section id="nosotros" style={{ backgroundColor: "#F8F3E8" }} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "#D9B96E" }}>
              ¿Por qué elegirnos?
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6" style={{ color: "#0A5D8F" }}>
              Más que una agencia,
              <br />
              <span style={{ color: "#0E84C7" }}>somos tu compañero</span>
              <br />
              de viaje
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#444444" }}>
              Somos una agencia de viajes con corazón campechano. Entendemos que viajar
              es una inversión emocional, y nos aseguramos de que cada peso que inviertas
              se convierta en un recuerdo que dure toda la vida.
            </p>
            <a
              href="https://wa.me/529991234567?text=Hola%2C%20quiero%20conocer%20más%20sobre%20Alexa%20Tours"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#0E84C7" }}
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Cards de razones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {razones.map((r) => (
              <div
                key={r.titulo}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-semibold text-base mb-2" style={{ color: "#0A5D8F" }}>
                  {r.titulo}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#444444" }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
