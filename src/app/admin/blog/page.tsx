"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface Articulo {
  id: number;
  titulo: string;
  slug: string;
  categoria: string;
  publicado: boolean;
  publicado_en: string;
  created_at: string;
}

export default function AdminBlogPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    apiFetch("/admin/blog")
      .then(setArticulos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const togglePublicado = async (a: Articulo) => {
    await apiFetch(`/admin/blog/${a.id}`, {
      method: "PUT",
      body: JSON.stringify({ publicado: !a.publicado }),
    });
    cargar();
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) return;
    await apiFetch(`/admin/blog/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Blog</h1>
          <p className="text-sm text-gray-400 mt-1">{articulos.length} artículos</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}
        >
          ✏️ Nuevo artículo
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : articulos.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <p className="text-5xl mb-4">📝</p>
          <p>Aún no hay artículos. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Título", "Slug", "Categoría", "Estado", "Fecha", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articulos.map((a) => (
                <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs" style={{ color: "#0A5D8F" }}>
                    <span className="line-clamp-1">{a.titulo}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    <span className="line-clamp-1">{a.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    {a.categoria ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {a.categoria}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublicado(a)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        a.publicado
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.publicado ? "✅ Publicado" : "📄 Borrador"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(a.publicado_en || a.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blog/${a.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                        style={{ backgroundColor: "#0E84C7" }}
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-gray-500 border border-gray-200 hover:bg-gray-50"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => eliminar(a.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-500 border border-red-200 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
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
