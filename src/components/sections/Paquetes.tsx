const paquetes = [
  {
    nombre: "Cancún Todo Incluido",
    destino: "Cancún, México",
    precio: 18500,
    dias: 7,
    imagen: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80",
    incluye: ["Vuelo redondo", "Hotel 5 estrellas", "Traslados", "All inclusive"],
    destacado: true,
  },
  {
    nombre: "Punta Cana Relax",
    destino: "República Dominicana",
    precio: 16900,
    dias: 6,
    imagen: "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600&q=80",
    incluye: ["Vuelo redondo", "Resort all-inclusive", "Traslados", "Snorkel"],
    destacado: true,
  },
  {
    nombre: "París Romántico",
    destino: "Francia",
    precio: 32000,
    dias: 8,
    imagen: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    incluye: ["Vuelo redondo", "Hotel boutique", "Desayunos", "Tour Versalles"],
    destacado: true,
  },
];

export default function Paquetes() {
  return (
    <section id="paquetes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Experiencias únicas
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
            Paquetes Destacados
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#444444" }}>
            Paquetes diseñados para que solo te preocupes por disfrutar.
            Todo incluido, con atención personalizada desde Campeche.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paquetes.map((p) => (
            <div
              key={p.nombre}
              className="rounded-2xl overflow-hidden shadow-lg flex flex-col border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-full object-cover"
                />
                {p.destacado && (
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: "#D9B96E", color: "#0A5D8F" }}
                  >
                    Destacado
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#0E84C7" }}>
                  {p.destino}
                </p>
                <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#0A5D8F" }}>
                  {p.nombre}
                </h3>

                {/* Incluye */}
                <ul className="space-y-1 mb-5 flex-1">
                  {p.incluye.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#444444" }}>
                      <span style={{ color: "#D9B96E" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Precio + CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-400">{p.dias} días</p>
                    <p className="font-heading text-2xl font-bold" style={{ color: "#0E84C7" }}>
                      ${p.precio.toLocaleString("es-MX")}
                    </p>
                    <p className="text-xs text-gray-400">MXN por persona</p>
                  </div>
                  <a
                    href={`https://wa.me/529991234567?text=Hola%2C%20me%20interesa%20el%20paquete%20${encodeURIComponent(p.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#0E84C7" }}
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver todos */}
        <div className="text-center mt-10">
          <a
            href="/paquetes"
            className="inline-block px-8 py-3 rounded-full border-2 font-semibold text-sm transition-all"
            style={{ borderColor: "#0E84C7", color: "#0E84C7" }}
          >
            Ver todos los paquetes
          </a>
        </div>
      </div>
    </section>
  );
}
