"use client";

import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

const faqs = [
  {
    categoria: "Reservas y pagos",
    preguntas: [
      {
        q: "¿Cómo puedo reservar un paquete?",
        a: "Puedes reservar directamente desde el sitio haciendo clic en 'Reservar' en cualquier paquete, o contactarnos por WhatsApp o correo. Te enviaremos una cotización personalizada en menos de 24 horas.",
      },
      {
        q: "¿Cuánto tiempo antes debo reservar?",
        a: "Recomendamos reservar con al menos 4-6 semanas de anticipación para garantizar disponibilidad y mejores precios. Para temporadas altas (Navidad, Semana Santa, verano) lo ideal es reservar con 2-3 meses de antelación.",
      },
      {
        q: "¿Qué formas de pago aceptan?",
        a: "Aceptamos transferencia bancaria, depósito, pago en efectivo y próximamente tarjeta de crédito/débito. Trabajamos con esquemas de apartado para que puedas asegurar tu viaje con un anticipo.",
      },
      {
        q: "¿Puedo pagar en mensualidades?",
        a: "¡Sí! Ofrecemos planes de pago a meses sin intereses dependiendo del paquete y fechas. Consúltanos y con gusto te armamos un plan a tu medida.",
      },
    ],
  },
  {
    categoria: "Cancelaciones y cambios",
    preguntas: [
      {
        q: "¿Qué pasa si necesito cancelar mi reserva?",
        a: "Las cancelaciones con más de 30 días de anticipación tienen reembolso del 80%. Con 15-30 días el 50%, y con menos de 15 días no aplica reembolso. Te recomendamos contratar un seguro de viaje.",
      },
      {
        q: "¿Puedo cambiar las fechas de mi viaje?",
        a: "Los cambios de fecha están sujetos a disponibilidad y posibles diferencias de tarifa. Contáctanos lo antes posible para gestionar el cambio sin cargos adicionales cuando sea posible.",
      },
    ],
  },
  {
    categoria: "Documentos y visas",
    preguntas: [
      {
        q: "¿Necesito visa para los destinos que ofrecen?",
        a: "Depende del destino y tu nacionalidad. Para México no necesitas visa si eres mexicano. Para Europa (París) y EE.UU. (Nueva York) sí se requiere visa según tu pasaporte. Te asesoramos en el proceso.",
      },
      {
        q: "¿Me ayudan con los trámites de visa?",
        a: "Sí, brindamos orientación completa sobre requisitos de visa, documentación necesaria y tiempos de tramitación. No gestionamos la visa directamente, pero te acompañamos en todo el proceso.",
      },
      {
        q: "¿Qué documentos necesito para viajar?",
        a: "Para México: identificación oficial. Para el extranjero: pasaporte vigente (mínimo 6 meses de vigencia), visa si aplica, y documentos del paquete que te proporcionamos (vouchers, itinerario, seguro de viaje).",
      },
    ],
  },
  {
    categoria: "Servicios incluidos",
    preguntas: [
      {
        q: "¿Qué incluyen los paquetes?",
        a: "Cada paquete es diferente. Generalmente incluyen vuelo redondo, hotel con desayunos o todo incluido, traslados aeropuerto-hotel y algunos tours. Revisa el detalle de cada paquete o consúltanos.",
      },
      {
        q: "¿El seguro de viaje está incluido?",
        a: "El seguro de viaje básico puede estar incluido en algunos paquetes. Recomendamos siempre contratar un seguro completo que cubra cancelaciones, emergencias médicas y pérdida de equipaje.",
      },
      {
        q: "¿Puedo personalizar un paquete?",
        a: "¡Absolutamente! Somos expertos en crear viajes a la medida. Si no encuentras el paquete que buscas, cuéntanos tus deseos y te armaremos una propuesta personalizada.",
      },
    ],
  },
  {
    categoria: "Sobre Alexa Tours",
    preguntas: [
      {
        q: "¿Dónde están ubicados?",
        a: "Somos una agencia de viajes del sureste de México con operaciones principalmente en Mérida, Yucatán. Atendemos a clientes de toda la república de forma presencial y virtual.",
      },
      {
        q: "¿Con qué aerolíneas trabajan?",
        a: "Trabajamos con las principales aerolíneas nacionales e internacionales: Aeroméxico, Volaris, Viva Aerobus, American Airlines, United Airlines, Air France y más, para conseguirte las mejores tarifas.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setAbierto(!abierto)}
      >
        <span className="text-sm font-semibold pr-4" style={{ color: "#0A5D8F" }}>{q}</span>
        <span className="flex-shrink-0 text-xl font-light" style={{ color: "#D9B96E" }}>
          {abierto ? "−" : "+"}
        </span>
      </button>
      {abierto && (
        <div className="px-5 py-4 text-sm leading-relaxed text-gray-600 bg-white border-t border-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Preguntas frecuentes
          </p>
          <h1 className="font-heading text-4xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
            ¿Tienes dudas?
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Aquí están las respuestas a las preguntas más comunes. ¿No encuentras lo que buscas?{" "}
            <Link href="/contacto" className="font-medium underline" style={{ color: "#0E84C7" }}>
              Escríbenos
            </Link>
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((seccion) => (
            <div key={seccion.categoria}>
              <h2 className="font-heading text-lg font-bold mb-4 px-1" style={{ color: "#0A5D8F" }}>
                {seccion.categoria}
              </h2>
              <div className="space-y-2">
                {seccion.preguntas.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-2xl mb-2">✈️</p>
          <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
            ¿Listo para viajar?
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Nuestros asesores están disponibles para ayudarte a planear el viaje perfecto.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0E84C7" }}>
              Cotizar mi viaje
            </Link>
            <Link href="/paquetes"
              className="px-6 py-2.5 rounded-full text-sm font-semibold border-2"
              style={{ borderColor: "#0E84C7", color: "#0E84C7" }}>
              Ver paquetes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
