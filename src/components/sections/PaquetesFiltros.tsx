"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Paquete {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_dias: number;
  imagen_url?: string;
  destino?: { nombre: string; pais: string } | string;
  destacado?: boolean;
  incluye?: string[] | string;
}

interface Destino {
  id: number;
  nombre: string;
  pais: string;
}

interface Props {
  paquetes: Paquete[];
  destinos: Destino[];
}

const DURACIONES = [
  { label: "Cualquier duración", value: "" },
  { label: "1–4 días", value: "1-4" },
  { label: "5–7 días", value: "5-7" },
  { label: "8–14 días", value: "8-14" },
  { label: "15+ días", value: "15+" },
];

const PRECIOS = [
  { label: "Cualquier precio", value: "" },
  { label: "Hasta $10,000", value: "0-10000" },
  { label: "$10,000 – $20,000", value: "10000-20000" },
  { label: "$20,000 – $35,000", value: "20000-35000" },
  { label: "Más de $35,000", value: "35000+" },
];

function getDestinoNombre(destino: Paquete["destino"]): string {
  if (!destino) return "";
  if (typeof destino === "string") return destino;
  return destino.nombre || "";
}

function parseIncluye(incluye: string[] | string | undefined): string[] {
  if (!incluye) return [];
  if (Array.isArray(incluye)) return incluye;
  try {
    const p = JSON.parse(incluye);
    if (Array.isArray(p)) return p;
  } catch {}
  return incluye.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function PaquetesFiltros({ paquetes, destinos }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [destinoFiltro, setDestinoFiltro] = useState("");
  const [precioFiltro, setPrecioFiltro] = useState("");
  const [duracionFiltro, setDuracionFiltro] = useState("");
  const [soloDestacados, setSoloDestacados] = useState(false);

  const filtrados = useMemo(() => {
    return paquetes.filter((p) => {
      const nombre = getDestinoNombre(p.destino);

      // Búsqueda texto
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          p.nombre.toLowerCase().includes(q) ||
          nombre.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Filtro destino
      if (destinoFiltro && nombre.toLowerCase() !== destinoFiltro.toLowerCase()) return false;

      // Filtro precio
      if (precioFiltro) {
        const precio = p.precio;
        if (precioFiltro === "0-10000" && precio > 10000) return false;
        if (precioFiltro === "10000-20000" && (precio < 10000 || precio > 20000)) return false;
        if (precioFiltro === "20000-35000" && (precio < 20000 || precio > 35000)) return false;
        if (precioFiltro === "35000+" && precio < 35000) return false;
      }

      // Filtro duración
      if (duracionFiltro) {
        const dias = p.duracion_dias;
        if (duracionFiltro === "1-4" && (dias < 1 || dias > 4)) return false;
        if (duracionFiltro === "5-7" && (dias < 5 || dias > 7)) return false;
        if (duracionFiltro === "8-14" && (dias < 8 || dias > 14)) return false;
        if (duracionFiltro === "15+" && dias < 15) return false;
      }

      // Solo destacados
      if (soloDestacados && !p.destacado) return false;

      return true;
    });
  }, [paquetes, busqueda, destinoFiltro, precioFiltro, duracionFiltro, soloDestacados]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setDestinoFiltro("");
    setPrecioFiltro("");
    setDuracionFiltro("");
    setSoloDestacados(false);
  };

  const hayFiltros = busqueda || destinoFiltro || precioFiltro || duracionFiltro || soloDestacados;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda */}
          <div className="sm:col-span-2 lg:col-span-1">
            <input
              type="search"
              placeholder="🔍 Buscar paquetes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
            />
          </div>

          {/* Destino */}
          <select
            value={destinoFiltro}
            onChange={(e) => setDestinoFiltro(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] bg-white"
          >
            <option value="">🌍 Todos los destinos</option>
            {destinos.map((d) => (
              <option key={d.id} value={d.nombre}>
                {d.nombre}
              </option>
            ))}
          </select>

          {/* Precio */}
          <select
            value={precioFiltro}
            onChange={(e) => setPrecioFiltro(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] bg-white"
          >
            {PRECIOS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Duración */}
          <select
            value={duracionFiltro}
            onChange={(e) => setDuracionFiltro(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] bg-white"
          >
            {DURACIONES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input
              type="checkbox"
              checked={soloDestacados}
              onChange={(e) => setSoloDestacados(e.target.checked)}
              className="w-4 h-4 accent-[#D9B96E]"
            />
            Solo paquetes destacados
          </label>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {filtrados.length} {filtrados.length === 1 ? "paquete" : "paquetes"}
            </span>
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="text-xs font-medium underline"
                style={{ color: "#0E84C7" }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de paquetes */}
      {filtrados.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">✈️</p>
          <p className="font-heading text-xl font-bold mb-2" style={{ color: "#0A5D8F" }}>
            No encontramos paquetes
          </p>
          <p className="text-sm text-gray-400 mb-6">Prueba ajustando los filtros</p>
          <button
            onClick={limpiarFiltros}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#0E84C7" }}
          >
            Ver todos los paquetes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtrados.map((p) => {
            const destinoNombre = getDestinoNombre(p.destino);
            const incluye = parseIncluye(p.incluye);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col border border-gray-100"
              >
                {/* Imagen */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={
                      p.imagen_url ||
                      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"
                    }
                    alt={p.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {p.destacado && (
                    <span
                      className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: "#D9B96E", color: "#fff" }}
                    >
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  {destinoNombre && (
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#0E84C7" }}>
                      {destinoNombre}
                    </p>
                  )}
                  <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#0A5D8F" }}>
                    {p.nombre}
                  </h3>

                  {/* Incluye (primeros 3) */}
                  {incluye.length > 0 && (
                    <ul className="space-y-1 mb-4 flex-1">
                      {incluye.slice(0, 4).map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#444" }}>
                          <span style={{ color: "#D9B96E" }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Precio + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">{p.duracion_dias} días</p>
                      <p className="font-heading text-2xl font-bold" style={{ color: "#0E84C7" }}>
                        ${p.precio.toLocaleString("es-MX")}
                      </p>
                      <p className="text-xs text-gray-400">MXN por persona</p>
                    </div>
                    <Link
                      href={`/paquetes/${p.id}`}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "#0E84C7" }}
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
