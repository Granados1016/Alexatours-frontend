"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface Cupon {
  id: number;
  codigo: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
  expiraEn?: string;
  maxUsos?: number;
  usosActuales: number;
  activo: boolean;
  createdAt: string;
}

const VACIO = {
  codigo: "", tipo: "porcentaje" as "porcentaje" | "fijo",
  valor: "", expiraEn: "", maxUsos: "", activo: true,
};

export default function AdminCuponesPage() {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargar = () => {
    apiFetch("/admin/cupones")
      .then(setCupones)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setForm(VACIO);
    setEditId(null);
    setError("");
    setModal(true);
  };

  const abrirEditar = (c: Cupon) => {
    setForm({
      codigo: c.codigo,
      tipo: c.tipo,
      valor: String(c.valor),
      expiraEn: c.expiraEn ? c.expiraEn.slice(0, 10) : "",
      maxUsos: c.maxUsos ? String(c.maxUsos) : "",
      activo: c.activo,
    });
    setEditId(c.id);
    setError("");
    setModal(true);
  };

  const guardar = async () => {
    if (!form.codigo.trim() || !form.valor) {
      setError("El código y valor son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const body = {
        codigo: form.codigo.toUpperCase().trim(),
        tipo: form.tipo,
        valor: Number(form.valor),
        expiraEn: form.expiraEn || undefined,
        maxUsos: form.maxUsos ? Number(form.maxUsos) : undefined,
        activo: form.activo,
      };
      if (editId) {
        await apiFetch(`/admin/cupones/${editId}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/admin/cupones", { method: "POST", body: JSON.stringify(body) });
      }
      setModal(false);
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: number, codigo: string) => {
    if (!confirm(`¿Eliminar el cupón "${codigo}"?`)) return;
    await apiFetch(`/admin/cupones/${id}`, { method: "DELETE" });
    cargar();
  };

  const toggleActivo = async (c: Cupon) => {
    await apiFetch(`/admin/cupones/${c.id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: !c.activo }),
    });
    cargar();
  };

  const activos = cupones.filter((c) => c.activo).length;

  return (
    <div className="p-8">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Cupones</h1>
          <p className="text-sm text-gray-400 mt-1">{cupones.length} cupones · {activos} activos</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}
        >
          ➕ Nuevo cupón
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Código", "Tipo", "Valor", "Usos", "Vence", "Estado", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cupones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay cupones todavía. Crea el primero.
                  </td>
                </tr>
              ) : (
                cupones.map((c) => (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: "#F8F3E8", color: "#0A5D8F" }}>
                        {c.codigo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{c.tipo}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#0E84C7" }}>
                      {c.tipo === "porcentaje" ? `${c.valor}%` : `$${Number(c.valor).toLocaleString("es-MX")}`}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {c.usosActuales}{c.maxUsos ? ` / ${c.maxUsos}` : " / ∞"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {c.expiraEn
                        ? new Date(c.expiraEn + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
                        : "Sin vencimiento"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActivo(c)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                        {c.activo ? "✅ Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => abrirEditar(c)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                          style={{ backgroundColor: "#0E84C7" }}>
                          Editar
                        </button>
                        <button onClick={() => eliminar(c.id, c.codigo)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-500 border border-red-200 hover:bg-red-50">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-heading text-xl font-bold mb-5" style={{ color: "#0A5D8F" }}>
              {editId ? "Editar cupón" : "Nuevo cupón"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Código *</label>
                <input
                  value={form.codigo}
                  onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                  placeholder="VERANO2025"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-[#0E84C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as "porcentaje" | "fijo" }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E84C7]"
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="fijo">Fijo (MXN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                    Valor * {form.tipo === "porcentaje" ? "(%)" : "(MXN)"}
                  </label>
                  <input
                    type="number"
                    value={form.valor}
                    onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    min={0}
                    max={form.tipo === "porcentaje" ? 100 : undefined}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E84C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Vencimiento</label>
                  <input
                    type="date"
                    value={form.expiraEn}
                    onChange={(e) => setForm((f) => ({ ...f, expiraEn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E84C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Máx. usos</label>
                  <input
                    type="number"
                    value={form.maxUsos}
                    onChange={(e) => setForm((f) => ({ ...f, maxUsos: e.target.value }))}
                    min={1}
                    placeholder="Ilimitado"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E84C7]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.activo}
                  onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                  className="w-4 h-4 accent-[#0E84C7]" />
                <span className="text-sm text-gray-600">Cupón activo</span>
              </label>
            </div>

            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={guardar} disabled={guardando}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "#0E84C7" }}>
                {guardando ? "Guardando..." : editId ? "Guardar cambios" : "Crear cupón"}
              </button>
              <button onClick={() => setModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
