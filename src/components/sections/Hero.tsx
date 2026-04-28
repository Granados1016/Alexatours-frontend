import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A5D8F 0%, #0E84C7 50%, #1a9fe0 100%)" }}
    >
      {/* Patrón decorativo de puntos dorados (guiño al logo) */}
      <div
        className="absolute top-20 left-10 w-40 h-40 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #D9B96E 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-56 h-56 opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle, #D9B96E 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Overlay de imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')" }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <p
          className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          style={{ color: "#D9B96E" }}
        >
          Agencia de Viajes · Campeche, México
        </p>

        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Viajes para{" "}
          <span style={{ color: "#D9B96E" }}>recordar</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Creamos experiencias únicas con atención personalizada y los mejores destinos del mundo.
          Tu próxima aventura comienza aquí.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/529991234567?text=Hola%2C%20me%20gustaría%20cotizar%20un%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "#D9B96E", color: "#0A5D8F" }}
          >
            ✈️ Cotiza tu viaje
          </a>
          <Link
            href="/#paquetes"
            className="px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/60 hover:bg-white/10 transition-all"
          >
            Ver paquetes
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { num: "500+", label: "Viajeros felices" },
            { num: "30+", label: "Destinos" },
            { num: "5★", label: "Calificación" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold" style={{ color: "#D9B96E" }}>
                {s.num}
              </p>
              <p className="text-xs text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flecha scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
