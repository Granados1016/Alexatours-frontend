"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import { exportarCSV } from "@/lib/csv";

interface Suscriptor {
  id: number;
  email: string;
  activo: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [lista, setLista] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const cargar = () => {
    apiFetch("/admin/newsletter")
      .then(setLista)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este suscriptor?")) return;
    setEliminando(id);
    try {
      await apiFetch(`/admin/newsletter/${id}`, { method: "DELETE" });
      setLista((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setEliminando(null);
    }
  };

  const filtrados = lista.filter((s) =>
    s.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const activos = lista.filter((s) => s.activo).length;

  const exportar = () => {
    exportarCSV(
      filtrados.map((s) => ({
        Email: s.email,
        Estado: s.activo ? "Activo" : "Inactivo",
        Fecha: new Date(s.createdAt).toLocaleDateString("es-MX"),
      })),
      "newsletter-suscriptores"
    );
  };

  return (
    <div className="p-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
            Newsletter
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {lista.length} suscriptores · {activos} activos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Buscar email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none w-full sm:w-56 focus:border-[#0E84C7]"
          />
          <button
            onClick={exportar}
            disabled={filtrados.length === 0}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 whitespace-nowrap"
            style={{ backgroundColor: "#10B981" }}
          >
            ⬇ CSV
          </button>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm text-center">
          <p className="text-2xl font-heading font-bold" style={{ color: "#0A5D8F" }}>{lista.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm text-center">
          <p className="text-2xl font-heading font-bold text-green-600">{activos}</p>
          <p className="text-xs text-gray-400 mt-0.5">Activos</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm text-center">
          <p className="text-2xl font-heading font-bold text-gray-400">{lista.length - activos}</p>
          <p className="text-xs text-gray-400 mt-0.5">Inactivos</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Email", "Estado", "Fecha de suscripción", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    {busqueda ? "Sin resultados." : "Aún no hay suscriptores."}
                  </td>
                </tr>
              ) : (
                filtrados.map((s) => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium" style={{ color: "#0A5D8F" }}>
                      <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        s.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      }`}>
                        {s.activo ? "✅ Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString("es-MX", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => eliminar(s.id)}
                        disabled={eliminando === s.id}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {eliminando === s.id ? "..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && lista.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Para enviar campañas, exporta el CSV e impórtalo en tu plataforma de email (Mailchimp, Brevo, etc.)
        </p>
      )}
    </div>
  );
}
