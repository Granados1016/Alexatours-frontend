"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";

interface Destino { id: number; nombre: string; }

const emptyForm = {
  nombre: "", descripcion: "", precio: "", duracionDias: "",
  incluye: "", imagenUrl: "", destinoId: "", activo: true, destacado: false,
  galeriaImagenes: "", itinerario: "", ofertaPrecio: "", ofertaHasta: "",
};

export default function PaqueteFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuevo";
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/destinos").then(setDestinos).catch(console.error);
    if (!isNew) {
      apiFetch(`/paquetes/${id}`)
        .then((p) => setForm({
          nombre: p.nombre ?? "",
          descripcion: p.descripcion ?? "",
          precio: p.precio ?? "",
          duracionDias: p.duracionDias ?? "",
          incluye: p.incluye ?? "",
          imagenUrl: p.imagenUrl ?? "",
          destinoId: p.destino?.id ?? "",
          activo: p.activo ?? true,
          destacado: p.destacado ?? false,
          galeriaImagenes: p.galeriaImagenes ?? "",
          itinerario: p.itinerario ?? "",
          ofertaPrecio: p.ofertaPrecio ?? "",
          ofertaHasta: p.ofertaHasta ? p.ofertaHasta.slice(0, 10) : "",
        }))
        .catch(() => setError("No se encontró el paquete"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        precio: Number(form.precio),
        duracionDias: Number(form.duracionDias),
        destinoId: form.destinoId ? Number(form.destinoId) : undefined,
        ofertaPrecio: form.ofertaPrecio ? Number(form.ofertaPrecio) : undefined,
        ofertaHasta: form.ofertaHasta || undefined,
      };
      if (isNew) {
        await apiFetch("/paquetes", { method: "POST", body: JSON.stringify(body) });
      } else {
        await apiFetch(`/paquetes/${id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      router.push("/admin/paquetes");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Cargando...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/paquetes" className="text-sm text-gray-400 hover:text-gray-600">← Volver</Link>
        <h1 className="font-heading text-2xl font-bold" style={{ color: "#0A5D8F" }}>
          {isNew ? "Nuevo Paquete" : "Editar Paquete"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-7 space-y-5">
        {/* Nombre */}
        <Field label="Nombre del paquete *">
          <input name="nombre" required value={form.nombre} onChange={handleChange}
            className={inputClass} placeholder="Cancún Todo Incluido" />
        </Field>

        {/* Descripción */}
        <Field label="Descripción">
          <textarea name="descripcion" rows={3} value={form.descripcion} onChange={handleChange}
            className={inputClass} placeholder="Descripción del paquete..." />
        </Field>

        {/* Precio + Días */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (MXN) *">
            <input name="precio" type="number" required value={form.precio} onChange={handleChange}
              className={inputClass} placeholder="18500" min={0} />
          </Field>
          <Field label="Duración (días) *">
            <input name="duracionDias" type="number" required value={form.duracionDias} onChange={handleChange}
              className={inputClass} placeholder="7" min={1} />
          </Field>
        </div>

        {/* Incluye */}
        <Field label="¿Qué incluye? (separado por comas)">
          <input name="incluye" value={form.incluye} onChange={handleChange}
            className={inputClass} placeholder="Vuelo redondo, Hotel 5 estrellas, Traslados" />
        </Field>

        {/* Destino */}
        <Field label="Destino">
          <select name="destinoId" value={form.destinoId} onChange={handleChange} className={inputClass}>
            <option value="">Sin destino asignado</option>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </Field>

        {/* Imagen */}
        <ImageUpload
          label="Imagen principal del paquete"
          value={form.imagenUrl}
          onChange={(url) => setForm((f) => ({ ...f, imagenUrl: url }))}
        />

        {/* Galería de imágenes */}
        <Field label="Galería de imágenes (URLs separadas por coma)">
          <textarea
            name="galeriaImagenes"
            rows={3}
            value={form.galeriaImagenes}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://imagen1.jpg, https://imagen2.jpg, ..."
          />
          <p className="text-xs text-gray-300 mt-1">Pega las URLs de las fotos adicionales del paquete</p>
        </Field>

        {/* Itinerario */}
        <Field label="Itinerario día a día (uno por línea: Día 1: Descripción)">
          <textarea
            name="itinerario"
            rows={5}
            value={form.itinerario}
            onChange={handleChange}
            className={inputClass}
            placeholder={"Día 1: Llegada al aeropuerto y traslado al hotel\nDía 2: Tour por la ciudad colonial\nDía 3: Excursión a ruinas arqueológicas"}
          />
        </Field>

        {/* Oferta */}
        <div className="p-4 rounded-xl border border-dashed border-orange-200" style={{ backgroundColor: "#FFFBF0" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "#B45309" }}>🔥 Precio de oferta (opcional)</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio oferta (MXN)">
              <input name="ofertaPrecio" type="number" value={form.ofertaPrecio} onChange={handleChange}
                className={inputClass} placeholder="15000" min={0} />
            </Field>
            <Field label="Válido hasta">
              <input name="ofertaHasta" type="date" value={form.ofertaHasta} onChange={handleChange}
                className={inputClass} />
            </Field>
          </div>
          <p className="text-xs text-orange-400 mt-2">Aparecerá en la página de Ofertas y en el detalle del paquete</p>
        </div>

        {/* Toggles */}
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="destacado" checked={form.destacado}
              onChange={handleChange} className="w-4 h-4 accent-[#D9B96E]" />
            <span className="text-sm font-medium" style={{ color: "#444" }}>⭐ Destacado en landing</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="activo" checked={form.activo}
              onChange={handleChange} className="w-4 h-4 accent-[#0E84C7]" />
            <span className="text-sm font-medium" style={{ color: "#444" }}>✅ Activo (visible al público)</span>
          </label>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#0E84C7" }}>
            {saving ? "Guardando..." : isNew ? "Crear paquete" : "Guardar cambios"}
          </button>
          <Link href="/admin/paquetes"
            className="px-6 py-3 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors bg-white";
