import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F8F3E8" }}
    >
      <div className="text-center max-w-md">
        {/* Número grande */}
        <p
          className="font-heading text-[120px] font-bold leading-none mb-4"
          style={{ color: "#E8EFF5" }}
        >
          404
        </p>

        <p className="text-5xl mb-6">✈️</p>

        <h1 className="font-heading text-2xl font-bold mb-3" style={{ color: "#0A5D8F" }}>
          ¡Parece que este vuelo no existe!
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          La página que buscas no está disponible. Quizás fue movida o el enlace es incorrecto.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#0E84C7" }}
          >
            Ir al inicio
          </Link>
          <Link
            href="/paquetes"
            className="px-6 py-3 rounded-full text-sm font-semibold border-2"
            style={{ borderColor: "#0E84C7", color: "#0E84C7" }}
          >
            Ver paquetes
          </Link>
          <Link
            href="/contacto"
            className="px-6 py-3 rounded-full text-sm font-semibold border-2 border-gray-200 text-gray-500"
          >
            Contactarnos
          </Link>
        </div>
      </div>
    </div>
  );
}
