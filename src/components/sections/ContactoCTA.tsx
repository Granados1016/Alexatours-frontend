export default function ContactoCTA() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A5D8F 0%, #0E84C7 100%)" }}
    >
      {/* Puntos decorativos */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #D9B96E 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "#D9B96E" }}>
          ¿Listo para viajar?
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
          Tu próxima aventura
          <br />
          comienza con un mensaje
        </h2>
        <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
          Escríbenos por WhatsApp y en menos de 24 horas tendrás tu cotización
          personalizada. Sin costo, sin compromiso.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/529991234567?text=Hola%2C%20me%20gustaría%20cotizar%20un%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full text-base font-bold shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: "#D9B96E", color: "#0A5D8F" }}
          >
            💬 Escríbenos por WhatsApp
          </a>
          <a
            href="mailto:hola@alexatours.mx"
            className="px-10 py-4 rounded-full text-base font-semibold border-2 border-white/60 text-white hover:bg-white/10 transition-all"
          >
            ✉️ Enviar correo
          </a>
        </div>

        <p className="mt-8 text-sm text-white/50">
          También puedes llamarnos al +52 999 123 4567 · Lunes a Sábado, 9am – 7pm
        </p>
      </div>
    </section>
  );
}
