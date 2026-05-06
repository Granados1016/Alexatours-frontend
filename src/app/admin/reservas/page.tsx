"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

type Estado = "pendiente" | "confirmada" | "cancelada";

interface Reserva {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  paqueteId: number;
  paqueteNombre: string;
  fechaViaje: string;
  numPersonas: number;
  notas: string;
  estado: Estado;
  precioTotal: number;
  createdAt: string;
}

const ESTADOS: Estado[] = ["pendiente", "confirmada", "cancelada"];

const estadoConfig: Record<Estado, { label: string; color: string; bg: string }> = {
  pendiente:  { label: "Pendiente",  color: "#B45309", bg: "#FEF3C7" },
  confirmada: { label: "Confirmada", color: "#065F46", bg: "#D1FAE5" },
  cancelada:  { label: "Cancelada",  color: "#991B1B", bg: "#FEE2E2" },
};

function nextEstado(actual: Estado): Estado {
  const idx = ESTADOS.indexOf(actual);
  return ESTADOS[(idx + 1) % ESTADOS.length];
}

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    apiFetch("/admin/reservas")
      .then(setReservas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cambiarEstado = async (id: number, estadoActual: Estado) => {
    const nuevoEstado = nextEstado(estadoActual);
    setActualizando(id);
    try {
      const updated = await apiFetch(`/admin/reservas/${id}`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: updated.estado } : r)));
    } catch (e) {
      console.error(e);
    } finally {
      setActualizando(null);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta reserva? Esta acción no se puede deshacer.")) return;
    setEliminando(id);
    try {
      await apiFetch(`/admin/reservas/${id}`, { method: "DELETE" });
      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setEliminando(null);
    }
  };

  const filtradas = reservas.filter((r) =>
    [r.nombre, r.email, r.telefono, r.paqueteNombre].some((v) =>
      v?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  // Contadores por estado
  const conteos = {
    pendiente:  reservas.filter((r) => r.estado === "pendiente").length,
    confirmada: reservas.filter((r) => r.estado === "confirmada").length,
    cancelada:  reservas.filter((r) => r.estado === "cancelada").length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
            Reservas
          </h1>
          <p className="text-sm text-gray-400 mt-1">{reservas.length} reservas en total</p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre, email, paquete..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none w-full sm:w-72 focus:border-[#0E84C7] transition-colors"
        />
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["pendiente", "confirmada", "cancelada"] as Estado[]).map((e) => {
          const cfg = estadoConfig[e];
          return (
            <div key={e} className="bg-white rounded-2xl px-5 py-4 shadow-sm text-center">
              <p className="text-2xl font-heading font-bold" style={{ color: cfg.color }}>
                {conteos[e]}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando reservas...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {[
                  "Cliente", "Paquete", "Fecha viaje", "Personas",
                  "Precio total", "Estado", "Creado", "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    {busqueda ? "Sin resultados para esa búsqueda." : "Aún no hay reservas."}
                  </td>
                </tr>
              ) : (
                filtradas.map((r) => {
                  const cfg = estadoConfig[r.estado] ?? estadoConfig.pendiente;
                  return (
                    <tr
                      key={r.id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      {/* Cliente */}
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: "#0A5D8F" }}>{r.nombre}</p>
                        <a
                          href={`mailto:${r.email}`}
                          className="text-xs text-[#0E84C7] hover:underline"
                        >
                          {r.email}
                        </a>
                        {r.telefono && (
                          <a
                            href={`https://wa.me/${r.telefono.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-green-600 hover:underline"
                          >
                            {r.telefono}
                          </a>
                        )}
                      </td>

                      {/* Paquete */}
                      <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                        <p className="truncate" title={r.paqueteNombre}>
                          {r.paqueteNombre || `#${r.paqueteId}`}
                        </p>
                      </td>

                      {/* Fecha viaje */}
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {r.fechaViaje
                          ? new Date(r.fechaViaje + "T12:00:00").toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Personas */}
                      <td className="px-4 py-3 text-center text-gray-600">
                        {r.numPersonas}
                      </td>

                      {/* Precio total */}
                      <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "#0E84C7" }}>
                        {r.precioTotal
                          ? `$${Number(r.precioTotal).toLocaleString("es-MX")} MXN`
                          : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => cambiarEstado(r.id, r.estado)}
                          disabled={actualizando === r.id}
                          className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                          style={{ color: cfg.color, backgroundColor: cfg.bg }}
                          title="Haz clic para cambiar estado"
                        >
                          {actualizando === r.id ? "..." : cfg.label}
                        </button>
                      </td>

                      {/* Creado */}
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {new Date(r.createdAt).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => eliminar(r.id)}
                          disabled={eliminando === r.id}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Eliminar reserva"
                        >
                          {eliminando === r.id ? "..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Notas */}
      {!loading && reservas.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Haz clic en el estado para cambiar: Pendiente → Confirmada → Cancelada → Pendiente
        </p>
      )}
    </div>
  );
}
