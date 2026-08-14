"use client";

import { useState } from "react";
import Link from "next/link";

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

function parseIncluye(incluye: string[] | string | undefined): string[] {
  if (!incluye) return [];
  if (Array.isArray(incluye)) return incluye;
  try {
    const p = JSON.parse(incluye);
    if (Array.isArray(p)) return p;
  } catch {}
  return incluye.split(",").map(s => s.trim()).filter(Boolean);
}

export default function ComparadorClient({ paquetes }: { paquetes: Paquete[] }) {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSeleccionados((prev) => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev; // máx 3
      return [...prev, id];
    });
  };

  const comparados = paquetes.filter(p => seleccionados.includes(p.id));

  return (
    <>
      {/* Selector de paquetes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <p className="text-sm font-semibold text-gray-500 mb-4">
          Selecciona los paquetes a comparar ({seleccionados.length}/3):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {paquetes.map((p) => {
            const isSelected = seleccionados.includes(p.id);
            const precio = p.ofertaPrecio && Number(p.ofertaPrecio) > 0
              ? Number(p.ofertaPrecio)
              : Number(p.precio);

            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                disabled={!isSelected && seleccionados.length >= 3}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all disabled:opacity-40 ${
                  isSelected
                    ? "border-[#D9B96E] bg-amber-50"
                    : "border-gray-200 hover:border-[#0E84C7] bg-white"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSelected ? "border-[#D9B96E] bg-[#D9B96E]" : "border-gray-300"
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#0A5D8F" }}>{p.nombre}</p>
                  <p className="text-xs text-gray-400">${precio.toLocaleString("es-MX")} MXN</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla comparativa */}
      {seleccionados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">⚖️</p>
          <p className="text-sm">Selecciona al menos 2 paquetes para comparar</p>
        </div>
      ) : seleccionados.length === 1 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Selecciona al menos un paquete más para comparar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            {/* Encabezados */}
            <thead>
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase bg-gray-50 w-40">
                  Característica
                </th>
                {comparados.map((p) => {
                  const img = p.imagenUrl || p.imagen_url;
                  return (
                    <th key={p.id} className="px-5 py-4 text-center border-l border-gray-100">
                      {img && (
                        <img src={img} alt={p.nombre}
                          className="w-full h-28 object-cover rounded-xl mb-3" />
                      )}
                      <p className="font-heading font-bold text-base" style={{ color: "#0A5D8F" }}>
                        {p.nombre}
                      </p>
                      {p.destino && (
                        <p className="text-xs text-gray-400 mt-0.5">{p.destino.nombre}</p>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Precio */}
              <tr className="border-t border-gray-100">
                <td className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                  💰 Precio
                </td>
                {comparados.map((p) => {
                  const precioFinal = p.ofertaPrecio && Number(p.ofertaPrecio) > 0 && Number(p.ofertaPrecio) < p.precio
                    ? Number(p.ofertaPrecio)
                    : Number(p.precio);
                  const minPrecio = Math.min(...comparados.map(c =>
                    c.ofertaPrecio && Number(c.ofertaPrecio) > 0 && Number(c.ofertaPrecio) < c.precio
                      ? Number(c.ofertaPrecio) : Number(c.precio)
                  ));
                  const esMasBajo = precioFinal === minPrecio;
                  return (
                    <td key={p.id} className="px-5 py-4 text-center border-l border-gray-100">
                      {p.ofertaPrecio && Number(p.ofertaPrecio) > 0 && Number(p.ofertaPrecio) < p.precio && (
                        <p className="text-xs text-gray-400 line-through">${Number(p.precio).toLocaleString("es-MX")}</p>
                      )}
                      <p className={`font-heading text-xl font-bold ${esMasBajo ? "text-green-600" : ""}`}
                        style={esMasBajo ? {} : { color: "#0E84C7" }}>
                        ${precioFinal.toLocaleString("es-MX")}
                      </p>
                      {esMasBajo && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Mejor precio
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Duración */}
              <tr className="border-t border-gray-100 bg-gray-50/50">
                <td className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                  📅 Duración
                </td>
                {comparados.map((p) => (
                  <td key={p.id} className="px-5 py-4 text-center border-l border-gray-100">
                    <span className="font-semibold">{p.duracionDias}</span>
                    <span className="text-gray-400 text-xs ml-1">{p.duracionDias === 1 ? "día" : "días"}</span>
                  </td>
                ))}
              </tr>

              {/* Destino */}
              <tr className="border-t border-gray-100">
                <td className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                  📍 Destino
                </td>
                {comparados.map((p) => (
                  <td key={p.id} className="px-5 py-4 text-center border-l border-gray-100 text-gray-600">
                    {p.destino?.nombre ?? "—"}
                  </td>
                ))}
              </tr>

              {/* Destacado */}
              <tr className="border-t border-gray-100 bg-gray-50/50">
                <td className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                  ⭐ Destacado
                </td>
                {comparados.map((p) => (
                  <td key={p.id} className="px-5 py-4 text-center border-l border-gray-100">
                    {p.destacado ? "⭐ Sí" : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>

              {/* Lo que incluye */}
              <tr className="border-t border-gray-100">
                <td className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase bg-gray-50 align-top pt-5">
                  ✅ Incluye
                </td>
                {comparados.map((p) => {
                  const items = parseIncluye(p.incluye);
                  return (
                    <td key={p.id} className="px-5 py-4 border-l border-gray-100 align-top">
                      {items.length > 0 ? (
                        <ul className="space-y-1 text-xs text-gray-600">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-green-500 flex-shrink-0">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-300 text-xs">Sin información</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* CTA */}
              <tr className="border-t border-gray-100 bg-gray-50/30">
                <td className="px-5 py-5 bg-gray-50"></td>
                {comparados.map((p) => (
                  <td key={p.id} className="px-5 py-5 text-center border-l border-gray-100">
                    <Link
                      href={`/paquetes/${p.id}`}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-white inline-block"
                      style={{ backgroundColor: "#0E84C7" }}
                    >
                      Ver paquete →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
