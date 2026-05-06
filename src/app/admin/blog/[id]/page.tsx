"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";
import MarkdownToolbar from "@/components/admin/MarkdownToolbar";

interface Form {
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  imagen_portada: string;
  categoria: string;
  tags: string;
  meta_descripcion: string;
  publicado: boolean;
}

const VACIO: Form = {
  titulo: "", slug: "", resumen: "", contenido: "",
  imagen_portada: "", categoria: "", tags: "", meta_descripcion: "", publicado: false,
};

const CATEGORIAS = ["Destinos", "Consejos de viaje", "Gastronomía", "Cultura", "Aventura", "Familia", "Lujo", "Presupuesto"];

export default function AdminBlogFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const esNuevo = id === "nuevo";
  const router = useRouter();

  const [form, setForm] = useState<Form>(VACIO);
  const [loading, setLoading] = useState(!esNuevo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (esNuevo) return;
    apiFetch(`/admin/blog/${id}`)
      .then((data) => {
        setForm({
          titulo: data.titulo || "",
          slug: data.slug || "",
          resumen: data.resumen || "",
          contenido: data.contenido || "",
          imagen_portada: data.imagen_portada || "",
          categoria: data.categoria || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          meta_descripcion: data.meta_descripcion || "",
          publicado: data.publicado || false,
        });
      })
      .catch(() => setError("No se pudo cargar el artículo"))
      .finally(() => setLoading(false));
  }, [id]);

  // Generar slug automático desde título
  const handleTituloChange = (titulo: string) => {
    const nuevoSlug = titulo.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, titulo, ...(esNuevo ? { slug: nuevoSlug } : {}) }));
  };

  const guardar = async () => {
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y el contenido son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const body = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (esNuevo) {
        await apiFetch("/admin/blog", { method: "POST", body: JSON.stringify(body) });
      } else {
        await apiFetch(`/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      router.push("/admin/blog");
    } catch {
      setError("Error al guardar el artículo");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Cargando...</div>;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 text-sm">← Volver</Link>
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: "#0A5D8F" }}>
            {esNuevo ? "Nuevo artículo" : "Editar artículo"}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => handleTituloChange(e.target.value)}
                placeholder="Título del artículo"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="url-del-articulo"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-300 mt-1">Se genera automáticamente desde el título</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Resumen</label>
              <textarea
                value={form.resumen}
                onChange={(e) => setForm((f) => ({ ...f, resumen: e.target.value }))}
                placeholder="Breve descripción del artículo (aparece en la lista del blog)"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Contenido *</label>
              <MarkdownToolbar
                textareaRef={contenidoRef}
                onChange={(val) => setForm((f) => ({ ...f, contenido: val }))}
              />
              <textarea
                ref={contenidoRef}
                value={form.contenido}
                onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
                placeholder="Escribe el contenido completo del artículo aquí..."
                rows={16}
                className="w-full border border-gray-200 rounded-b-xl rounded-t-none px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-y font-mono border-t-0"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#0A5D8F" }}>🔍 SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Meta descripción</label>
                <textarea
                  value={form.meta_descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, meta_descripcion: e.target.value }))}
                  placeholder="Descripción para Google (máx. 160 caracteres)"
                  rows={2}
                  maxLength={160}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
                <p className="text-xs text-gray-300 mt-1">{form.meta_descripcion.length}/160</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Tags (separados por coma)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="viaje, cancún, playa, familia"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publicar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#0A5D8F" }}>Publicación</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.publicado}
                onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-600">Publicar artículo</span>
            </label>
            <p className="text-xs text-gray-300 mt-2">
              {form.publicado ? "✅ Visible en el sitio público" : "📄 Solo visible en el admin"}
            </p>
            <button
              onClick={guardar}
              disabled={guardando}
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#0E84C7" }}
            >
              {guardando ? "Guardando..." : esNuevo ? "Crear artículo" : "Guardar cambios"}
            </button>
          </div>

          {/* Categoría */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-sm mb-3" style={{ color: "#0A5D8F" }}>Categoría</h2>
            <select
              value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Sin categoría</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Imagen */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-sm mb-3" style={{ color: "#0A5D8F" }}>Imagen de portada</h2>
            <ImageUpload
              label=""
              value={form.imagen_portada}
              onChange={(url) => setForm((f) => ({ ...f, imagen_portada: url }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
