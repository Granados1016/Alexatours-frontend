const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Testimonio {
  id: number;
  nombre: string;
  ciudad?: string;
  texto: string;
  estrellas: number;
  avatar?: string;
  activo?: boolean;
}

const FALLBACK: Testimonio[] = [
  {
    id: 1,
    nombre: "Laura M.",
    ciudad: "Campeche",
    texto: "Viajé con mi esposo a Cancún gracias a Alexa Tours y fue perfecto. Todo estaba organizado al detalle, no tuvimos que preocuparnos por nada. ¡Ya estamos planeando el siguiente!",
    estrellas: 5,
    avatar: "👩",
  },
  {
    id: 2,
    nombre: "Carlos R.",
    ciudad: "Mérida",
    texto: "Llevé a mi familia a Punta Cana por primera vez. La atención fue increíble, muy personal y siempre dispuestos a resolver cualquier duda. Lo recomiendo ampliamente.",
    estrellas: 5,
    avatar: "👨",
  },
  {
    id: 3,
    nombre: "Ana y Pedro",
    ciudad: "Campeche",
    texto: "Nuestro viaje de bodas a París superó todas las expectativas. Alexa Tours eligió el hotel perfecto y los tours más románticos. ¡Gracias por hacer ese momento tan especial!",
    estrellas: 5,
    avatar: "👫",
  },
];

async function getTestimonios(): Promise<Testimonio[]> {
  try {
    const res = await fetch(`${API_URL}/testimonios`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    const arr: Testimonio[] = Array.isArray(data) ? data : (data.data ?? []);
    const activos = arr.filter((t) => t.activo !== false);
    return activos.length > 0 ? activos : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function Testimonios() {
  const testimonios = await getTestimonios();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonios.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col gap-4"
              style={{ backgroundColor: "#F8F3E8" }}
            >
              {/* Estrellas */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(t.estrellas ?? 5, 5) }).map((_, i) => (
                  <span key={i} style={{ color: "#D9B96E" }}>★</span>
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-relaxed italic flex-1" style={{ color: "#444444" }}>
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Avatar + datos */}
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-200">
                <span className="text-2xl">{t.avatar || "🌟"}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#0A5D8F" }}>
                    {t.nombre}
                  </p>
                  {t.ciudad && (
                    <p className="text-xs text-gray-400">{t.ciudad}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
