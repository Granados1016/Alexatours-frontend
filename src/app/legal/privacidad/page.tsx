import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — Alexa Tours",
  description: "Conoce cómo Alexa Tours protege y maneja tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Inicio</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
          <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-400 mb-8">Última actualización: enero 2025</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>1. Responsable del tratamiento</h2>
              <p>Alexa Tours, agencia de viajes con operaciones en el sureste de México, es responsable del tratamiento de los datos personales que nos proporcione. Puede contactarnos en <a href="mailto:hola@alexatours.mx" className="text-[#0E84C7] underline">hola@alexatours.mx</a>.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>2. Datos que recopilamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono / WhatsApp</li>
                <li>Ciudad de residencia</li>
                <li>Información de los viajes que cotiza o reserva</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>3. Finalidad del uso de datos</h2>
              <p>Sus datos se utilizan para:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Responder a sus consultas y cotizaciones de viaje</li>
                <li>Gestionar reservaciones y pagos</li>
                <li>Enviar información sobre paquetes y promociones (solo si acepta)</li>
                <li>Mejorar nuestros servicios</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>4. Cookies</h2>
              <p>Nuestro sitio puede utilizar cookies para análisis de tráfico web (Google Analytics). Estas cookies no contienen información personal identificable y pueden desactivarse desde la configuración de su navegador.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>5. Compartir información</h2>
              <p>No vendemos ni compartimos sus datos personales con terceros, excepto cuando sea necesario para la prestación del servicio (aerolíneas, hoteles, proveedores de viaje) o cuando la ley lo exija.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>6. Sus derechos (ARCO)</h2>
              <p>Tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, escríbanos a <a href="mailto:hola@alexatours.mx" className="text-[#0E84C7] underline">hola@alexatours.mx</a>.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>7. Seguridad</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra pérdida, mal uso, acceso no autorizado o divulgación.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>8. Cambios a esta política</h2>
              <p>Podemos actualizar esta política ocasionalmente. Le notificaremos de cambios significativos. El uso continuado de nuestro sitio implica la aceptación de la política vigente.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
