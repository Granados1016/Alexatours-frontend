"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface Testimonio {
  id: number;
  nombre: string;
  origen: string;
  comentario: string;
  estrellas: number;
  activo: boolean;
  orden: number;
}

const VACIO = { nombre: "", origen: "", comentario: "", estrellas: 5, activo: true, orden: 0 };

export default function AdminTestimoniosPage() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Testimonio | null>(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);

  const cargar = () => {
    apiFetch("/admin/testimonios")
      .then(setTestimonios)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const abrir = (t?: Testimonio) => {
    if (t) {
      setEditando(t);
      setForm({ nombre: t.nombre, origen: t.origen || "", comentario: t.comentario, estrellas: t.estrellas, activo: t.activo, orden: t.orden });
    } else {
      setEditando(null);
      setForm(VACIO);
    }
    setModal(true);
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      if (editando) {
        await apiFetch(`/admin/testimonios/${editando.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await apiFetch("/admin/testimonios", { method: "POST", body: JSON.stringify(form) });
      }
      setModal(false);
      cargar();
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await apiFetch(`/admin/testimonios/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Testimonios</h1>
          <p className="text-sm text-gray-400 mt-1">{testimonios.length} testimonios</p>
        </div>
        <button
          onClick={() => abrir()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}
        >
          ➕ Nuevo testimonio
        </button>
      </div>

      {loading ? <p className="text-gray-400">Cargando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonios.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#0A5D8F" }}>{t.nombre}</p>
                  {t.origen && <p className="text-xs text-gray-400">{t.origen}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.activo ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {t.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="text-yellow-400 text-sm mb-2">{"⭐".repeat(t.estrellas)}</div>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{t.comentario}</p>
              <div className="flex gap-2">
                <button onClick={() => abrir(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Editar</button>
                <button onClick={() => eliminar(t.id)} className="text-xs py-1.5 px-3 rounded-lg border border-red-200 text-red-400 hover:bg-red-50">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-bold text-lg mb-5" style={{ color: "#0A5D8F" }}>
              {editando ? "Editar testimonio" : "Nuevo testimonio"}
            </h2>
            <div className="space-y-3">
              <input type="text" placeholder="Nombre *" value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              <input type="text" placeholder="Ciudad / País de origen" value={form.origen}
                onChange={(e) => setForm((f) => ({ ...f, origen: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              <textarea placeholder="Comentario *" value={form.comentario} rows={4}
                onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Estrellas</label>
                  <select value={form.estrellas} onChange={(e) => setForm((f) => ({ ...f, estrellas: +e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Orden</label>
                  <input type="number" value={form.orden} min={0}
                    onChange={(e) => setForm((f) => ({ ...f, orden: +e.target.value }))}
                    className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={form.activo}
                    onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-600">Activo</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">Cancelar</button>
              <button onClick={guardar} disabled={guardando}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "#0E84C7" }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
