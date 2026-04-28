const testimonios = [
  {
    nombre: "Laura M.",
    ciudad: "Campeche",
    texto:
      "Viajé con mi esposo a Cancún gracias a Alexa Tours y fue perfecto. Todo estaba organizado al detalle, no tuvimos que preocuparnos por nada. ¡Ya estamos planeando el siguiente!",
    estrellas: 5,
    avatar: "👩",
  },
  {
    nombre: "Carlos R.",
    ciudad: "Mérida",
    texto:
      "Llevé a mi familia a Punta Cana por primera vez. La atención fue increíble, muy personal y siempre dispuestos a resolver cualquier duda. Lo recomiendo ampliamente.",
    estrellas: 5,
    avatar: "👨",
  },
  {
    nombre: "Ana y Pedro",
    ciudad: "Campeche",
    texto:
      "Nuestro viaje de bodas a París superó todas las expectativas. Alexa Tours eligió el hotel perfecto y los tours más románticos. ¡Gracias por hacer ese momento tan especial!",
    estrellas: 5,
    avatar: "👫",
  },
];

export default function Testimonios() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Lo que dicen nuestros viajeros
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold" style={{ color: "#0A5D8F" }}>
            Historias que nos inspiran
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((t) => (
            <div
              key={t.nombre}
              className="rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col gap-4"
              style={{ backgroundColor: "#F8F3E8" }}
            >
              {/* Estrellas */}
              <div className="flex gap-1">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <span key={i} style={{ color: "#D9B96E" }}>★</span>
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-relaxed italic" style={{ color: "#444444" }}>
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Avatar + datos */}
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-200">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#0A5D8F" }}>
                    {t.nombre}
                  </p>
                  <p className="text-xs text-gray-400">{t.ciudad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
