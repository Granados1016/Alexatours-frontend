"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "staff";
  activo: boolean;
  createdAt: string;
}

const VACIO: { nombre: string; email: string; password: string; rol: "admin" | "staff" } = { nombre: "", email: "", password: "", rol: "staff" };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargar = () => {
    setLoading(true);
    apiFetch("/admin/usuarios").then(setUsuarios).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(VACIO);
    setError("");
    setModalAbierto(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, password: "", rol: u.rol });
    setError("");
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.email.trim()) { setError("Nombre y email son obligatorios"); return; }
    if (!editando && !form.password.trim()) { setError("La contraseña es obligatoria para nuevos usuarios"); return; }
    setGuardando(true);
    setError("");
    try {
      const body: Record<string, string> = { nombre: form.nombre, email: form.email, rol: form.rol };
      if (form.password) body.password = form.password;

      if (editando) {
        await apiFetch(`/admin/usuarios/${editando.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/admin/usuarios", { method: "POST", body: JSON.stringify(body) });
      }
      setModalAbierto(false);
      cargar();
    } catch {
      setError("Error al guardar. Verifica que el email no esté en uso.");
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (u: Usuario) => {
    try {
      await apiFetch(`/admin/usuarios/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({ activo: !u.activo }),
      });
      cargar();
    } catch (e) { console.error(e); }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este usuario? No podrá recuperarse.")) return;
    try {
      await apiFetch(`/admin/usuarios/${id}`, { method: "DELETE" });
      cargar();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Usuarios</h1>
          <p className="text-sm text-gray-400 mt-1">Gestiona el acceso al panel administrativo</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}
        >
          + Nuevo usuario
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Nombre", "Email", "Rol", "Estado", "Creado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No hay usuarios registrados</td></tr>
              ) : usuarios.map((u) => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium" style={{ color: "#0A5D8F" }}>{u.nombre}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: u.rol === "admin" ? "#0A5D8F" : "#6B7280" }}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActivo(u)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-5 py-3 flex items-center gap-3">
                    <button onClick={() => abrirEditar(u)} className="text-xs font-medium text-[#0E84C7] hover:underline">
                      Editar
                    </button>
                    <button onClick={() => eliminar(u.id)} className="text-xs font-medium text-red-400 hover:text-red-600">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-heading text-xl font-bold mb-5" style={{ color: "#0A5D8F" }}>
              {editando ? "Editar usuario" : "Nuevo usuario"}
            </h2>
            {error && <p className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0E84C7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0E84C7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  {editando ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0E84C7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as "admin" | "staff" }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0E84C7] bg-white"
                >
                  <option value="staff">Staff (acceso limitado)</option>
                  <option value="admin">Admin (acceso completo)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "#0E84C7" }}
              >
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
