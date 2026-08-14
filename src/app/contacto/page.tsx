"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", ciudad: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      // Guardar como mensaje de contacto
      const res = await fetch(`${API}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          asunto: `Cotización de viaje desde ${form.ciudad || "sitio web"}`,
          mensaje: form.mensaje,
        }),
      });
      if (res.ok) {
        // También registrar como cliente potencial
        await fetch(`${API}/clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).catch(() => {});
        setEnviado(true);
      }
    } catch {
      const msg = `Hola, soy ${form.nombre}. ${form.mensaje}`;
      window.open(`https://wa.me/529991234567?text=${encodeURIComponent(msg)}`, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Hablemos
          </p>
          <h1 className="font-heading text-4xl font-bold mb-3" style={{ color: "#0A5D8F" }}>
            Cotiza tu viaje
          </h1>
          <p className="text-sm" style={{ color: "#444444" }}>
            Déjanos tus datos y te contactamos en menos de 24 horas con tu propuesta personalizada.
          </p>
        </div>

        {enviado ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto">
            <p className="text-4xl mb-4">✈️</p>
            <h2 className="font-heading text-2xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
              ¡Recibimos tu mensaje!
            </h2>
            <p className="text-sm text-gray-500">
              Te contactaremos muy pronto. Mientras tanto, también puedes escribirnos por WhatsApp.
            </p>
            <a
              href="https://wa.me/52995305412"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0E84C7" }}
            >
              Ir a WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm space-y-5">
            {[
              { name: "nombre", label: "Nombre completo *", type: "text", required: true },
              { name: "email", label: "Correo electrónico", type: "email", required: false },
              { name: "telefono", label: "Teléfono / WhatsApp", type: "tel", required: false },
              { name: "ciudad", label: "Ciudad de origen", type: "text", required: false },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#444444" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  value={(form as Record<string, string>)[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": "#0E84C7" } as React.CSSProperties}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#444444" }}>
                ¿A dónde quieres viajar? / Mensaje
              </label>
              <textarea
                name="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Ej: Me interesa un paquete a Cancún para 2 personas en julio..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#0E84C7" }}
            >
              {loading ? "Enviando..." : "Enviar cotización ✈️"}
            </button>

            <p className="text-xs text-center text-gray-400">
              ¿Prefieres WhatsApp?{" "}
              <a
                href="https://wa.me/529991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
                style={{ color: "#0E84C7" }}
              >
                Escríbenos aquí
              </a>
            </p>
          </form>

          {/* Columna derecha: info + mapa */}
          <div className="lg:col-span-2 space-y-4">
            {/* Info de contacto */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-bold" style={{ color: "#0A5D8F" }}>Encuéntranos</h3>
              <div className="space-y-3 text-sm" style={{ color: "#444" }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-medium">Mérida, Yucatán</p>
                    <p className="text-gray-400">Sureste de México</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <a href="https://wa.me/52995305412" target="_blank" rel="noopener noreferrer"
                    className="font-medium hover:underline" style={{ color: "#0E84C7" }}>
                    +52 995 305 4120
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <a href="mailto:hola@alexatours.mx"
                    className="font-medium hover:underline" style={{ color: "#0E84C7" }}>
                    hola@alexatours.mx
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🕐</span>
                  <p className="text-gray-400">Lun–Sáb · 9:00 – 18:00 hrs</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden shadow-sm h-64">
              <iframe
                src="https://maps.google.com/maps?q=Merida,Yucatan,Mexico&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Alexa Tours — Mérida, Yucatán"
              />
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
