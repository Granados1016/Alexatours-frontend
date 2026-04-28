"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyForm = { nombre: "", pais: "", descripcion: "", imagenUrl: "", activo: true };

export default function DestinoFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuevo";
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      apiFetch(`/destinos/${id}`)
        .then((d) => setForm({
          nombre: d.nombre ?? "", pais: d.pais ?? "",
          descripcion: d.descripcion ?? "", imagenUrl: d.imagenUrl ?? "", activo: d.activo ?? true,
        }))
        .catch(() => setError("No se encontró el destino"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) await apiFetch("/destinos", { method: "POST", body: JSON.stringify(form) });
      else await apiFetch(`/destinos/${id}`, { method: "PUT", body: JSON.stringify(form) });
      router.push("/admin/destinos");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Cargando...</div>;

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors";

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/destinos" className="text-sm text-gray-400 hover:text-gray-600">← Volver</Link>
        <h1 className="font-heading text-2xl font-bold" style={{ color: "#0A5D8F" }}>
          {isNew ? "Nuevo Destino" : "Editar Destino"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-7 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>Nombre *</label>
            <input name="nombre" required value={form.nombre} onChange={handleChange} className={inputClass} placeholder="Cancún" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>País *</label>
            <input name="pais" required value={form.pais} onChange={handleChange} className={inputClass} placeholder="México" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>Descripción</label>
          <textarea name="descripcion" rows={3} value={form.descripcion} onChange={handleChange}
            className={inputClass} placeholder="Descripción del destino..." />
        </div>

        <ImageUpload label="Imagen del destino" value={form.imagenUrl}
          onChange={(url) => setForm((f) => ({ ...f, imagenUrl: url }))} />

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-[#0E84C7]" />
          <span className="text-sm font-medium" style={{ color: "#444" }}>✅ Activo (visible al público)</span>
        </label>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#0E84C7" }}>
            {saving ? "Guardando..." : isNew ? "Crear destino" : "Guardar cambios"}
          </button>
          <Link href="/admin/destinos" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
