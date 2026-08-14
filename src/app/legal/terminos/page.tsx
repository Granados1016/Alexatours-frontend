import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Alexa Tours",
  description: "Términos y condiciones de uso de los servicios de Alexa Tours.",
};

export default function TerminosPage() {
  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Inicio</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
          <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
            Términos y Condiciones
          </h1>
          <p className="text-sm text-gray-400 mb-8">Última actualización: enero 2025</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>1. Aceptación</h2>
              <p>Al utilizar los servicios de Alexa Tours, usted acepta estos términos y condiciones. Si no está de acuerdo, le pedimos no utilizar nuestros servicios.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>2. Reservaciones</h2>
              <p>Las reservaciones quedan confirmadas una vez recibido el pago del anticipo acordado. Los precios pueden variar hasta la confirmación definitiva de la reserva por parte de proveedores (aerolíneas, hoteles).</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>3. Pagos y cancelaciones</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Las cancelaciones con <strong>más de 30 días</strong> de anticipación: reembolso del 80% del anticipo.</li>
                <li>Con <strong>15 a 30 días</strong> de anticipación: reembolso del 50%.</li>
                <li>Con <strong>menos de 15 días</strong>: sin reembolso.</li>
                <li>Los cambios de fecha están sujetos a disponibilidad y diferencias de tarifa.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>4. Responsabilidad</h2>
              <p>Alexa Tours actúa como intermediario entre el viajero y los proveedores de servicios turísticos (aerolíneas, hoteles, transportistas). No somos responsables por cancelaciones, demoras o modificaciones realizadas directamente por dichos proveedores.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>5. Seguro de viaje</h2>
              <p>Recomendamos ampliamente la contratación de un seguro de viaje que cubra cancelaciones por causas de fuerza mayor, emergencias médicas y pérdida de equipaje. Alexa Tours no se hace responsable por gastos derivados de la ausencia de seguro.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>6. Documentación</h2>
              <p>El viajero es responsable de contar con la documentación necesaria (pasaporte, visa, vacunas) para los destinos contratados. Alexa Tours brinda orientación pero no se hace responsable por rechazos de ingreso por documentación incompleta.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>7. Modificaciones</h2>
              <p>Alexa Tours se reserva el derecho de modificar estos términos en cualquier momento. Los cambios aplican a partir de su publicación en este sitio.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-3" style={{ color: "#0A5D8F" }}>8. Contacto</h2>
              <p>Para cualquier duda sobre estos términos, contáctenos en <a href="mailto:hola@alexatours.mx" className="text-[#0E84C7] underline">hola@alexatours.mx</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
