"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface Cliente {
  id: number; nombre: string; email: string;
  telefono: string; ciudad: string; mensaje: string; createdAt: string;
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    apiFetch("/clientes").then(setClientes).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtrados = clientes.filter((c) =>
    [c.nombre, c.email, c.telefono, c.ciudad].some((v) =>
      v?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Clientes / Leads</h1>
          <p className="text-sm text-gray-400 mt-1">{clientes.length} contactos recibidos</p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre, email, ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none w-72 focus:border-[#0E84C7] transition-colors"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Nombre", "Email", "Teléfono", "Ciudad", "Mensaje", "Fecha"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    {busqueda ? "Sin resultados para esa búsqueda." : "Aún no hay clientes registrados."}
                  </td>
                </tr>
              ) : filtrados.map((c) => (
                <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: "#0A5D8F" }}>{c.nombre}</td>
                  <td className="px-4 py-3">
                    {c.email
                      ? <a href={`mailto:${c.email}`} className="text-[#0E84C7] hover:underline">{c.email}</a>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {c.telefono
                      ? <a href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                          className="text-green-600 hover:underline">
                          {c.telefono}
                        </a>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.ciudad || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 max-w-xs">
                    {c.mensaje
                      ? <p className="text-gray-500 truncate" title={c.mensaje}>{c.mensaje}</p>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
