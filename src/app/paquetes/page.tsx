import PaquetesFiltros from "@/components/sections/PaquetesFiltros";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paquetes de Viaje — Alexa Tours",
  description:
    "Explora todos nuestros paquetes de viaje a Cancún, Punta Cana, París, Nueva York y más. Filtra por destino, precio y duración. Salidas desde Campeche.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getPaquetes() {
  try {
    const res = await fetch(`${API_URL}/paquetes`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data.data ?? []);
    return arr.filter((p: { activo?: boolean }) => p.activo !== false);
  } catch {
    return [];
  }
}

async function getDestinos() {
  try {
    const res = await fetch(`${API_URL}/destinos`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

export default async function PaquetesPage() {
  const [paquetes, destinos] = await Promise.all([getPaquetes(), getDestinos()]);

  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
          Viaja con nosotros
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0A5D8F" }}>
          Todos los Paquetes
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "#444444" }}>
          Encuentra el viaje perfecto. Filtra por destino, presupuesto o duración.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/comparador"
            className="px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:opacity-80"
            style={{ borderColor: "#0E84C7", color: "#0E84C7" }}>
            ⚖️ Comparar paquetes
          </Link>
          <Link href="/ofertas"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#EF4444" }}>
            🔥 Ver ofertas
          </Link>
        </div>
      </div>

      <PaquetesFiltros paquetes={paquetes} destinos={destinos} />
    </div>
  );
}
