const destinos = [
  {
    nombre: "Cancún",
    pais: "México",
    imagen: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80",
    emoji: "🏖️",
  },
  {
    nombre: "Punta Cana",
    pais: "Rep. Dominicana",
    imagen: "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600&q=80",
    emoji: "🌴",
  },
  {
    nombre: "París",
    pais: "Francia",
    imagen: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    emoji: "🗼",
  },
  {
    nombre: "Nueva York",
    pais: "Estados Unidos",
    imagen: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    emoji: "🗽",
  },
  {
    nombre: "Mérida",
    pais: "México",
    imagen: "https://images.unsplash.com/photo-1574436328-c6d3703f6a17?w=600&q=80",
    emoji: "🏛️",
  },
  {
    nombre: "Ciudad de México",
    pais: "México",
    imagen: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&q=80",
    emoji: "🌆",
  },
];

export default function Destinos() {
  return (
    <section id="destinos" style={{ backgroundColor: "#F8F3E8" }} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Explora el mundo
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
            Destinos Destacados
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#444444" }}>
            Desde las playas del Caribe hasta las ciudades más icónicas del mundo.
            Tenemos el destino perfecto para ti.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinos.map((d) => (
            <div
              key={d.nombre}
              className="group relative overflow-hidden rounded-2xl shadow-md cursor-pointer"
              style={{ height: "280px" }}
            >
              {/* Imagen */}
              <img
                src={d.imagen}
                alt={d.nombre}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Texto */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-2xl mb-1">{d.emoji}</p>
                <h3 className="font-heading text-xl font-bold text-white">{d.nombre}</h3>
                <p className="text-sm text-white/70">{d.pais}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
