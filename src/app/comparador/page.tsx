import type { Metadata } from "next";
import Link from "next/link";
import ComparadorClient from "./ComparadorClient";

export const metadata: Metadata = {
  title: "Comparar Paquetes — Alexa Tours",
  description: "Compara nuestros paquetes de viaje lado a lado y elige el que mejor se adapte a ti.",
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionDias: number;
  imagenUrl?: string;
  imagen_url?: string;
  incluye?: string[] | string;
  destino?: { nombre: string };
  destacado?: boolean;
  ofertaPrecio?: number;
}

async function getPaquetes(): Promise<Paquete[]> {
  try {
    const res = await fetch(`${API}/paquetes`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ComparadorPage() {
  const paquetes = await getPaquetes();

  return (
    <div className="pt-24 min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "#D9B96E" }}>
            Comparador
          </p>
          <h1 className="font-heading text-4xl font-bold mb-3" style={{ color: "#0A5D8F" }}>
            Compara paquetes
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Selecciona hasta 3 paquetes para compararlos lado a lado y elegir el ideal para ti.
          </p>
        </div>

        <ComparadorClient paquetes={paquetes} />
      </div>
    </div>
  );
}
