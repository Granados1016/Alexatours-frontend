"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface Paquete {
  id: number;
  nombre: string;
  precio: string;
  duracionDias: number;
  destacado: boolean;
  activo: boolean;
  imagenUrl: string;
  destino?: { nombre: string };
}

export default function AdminPaquetesPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicando, setDuplicando] = useState<number | null>(null);

  const cargar = () => {
    apiFetch("/paquetes")
      .then(setPaquetes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const duplicar = async (p: Paquete) => {
    setDuplicando(p.id);
    try {
      const original = await apiFetch(`/paquetes/${p.id}`);
      const body = {
        nombre: `${original.nombre} (copia)`,
        descripcion: original.descripcion,
        precio: original.precio,
        duracionDias: original.duracionDias,
        incluye: original.incluye,
        imagenUrl: original.imagenUrl,
        destinoId: original.destino?.id,
        activo: false,
        destacado: false,
        galeriaImagenes: original.galeriaImagenes,
        itinerario: original.itinerario,
      };
      await apiFetch("/paquetes", { method: "POST", body: JSON.stringify(body) });
      cargar();
    } catch (e) {
      console.error(e);
    } finally {
      setDuplicando(null);
    }
  };

  const toggleActivo = async (p: Paquete) => {
    await apiFetch(`/paquetes/${p.id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: !p.activo }),
    });
    cargar();
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Desactivar este paquete?")) return;
    await apiFetch(`/paquetes/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Paquetes</h1>
          <p className="text-sm text-gray-400 mt-1">{paquetes.length} paquetes registrados</p>
        </div>
        <Link
          href="/admin/paquetes/nuevo"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}
        >
          ➕ Nuevo paquete
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead style={{ backgroundColor: "#F8F3E8" }}>
              <tr>
                {["Imagen", "Nombre", "Destino", "Precio", "Días", "Dest.", "Activo", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paquetes.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt={p.nombre} className="w-14 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#0A5D8F" }}>{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-400">{p.destino?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#0E84C7" }}>
                    ${Number(p.precio).toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{p.duracionDias}d</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.destacado ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-400"}`}>
                      {p.destacado ? "⭐ Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActivo(p)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                      {p.activo ? "✅ Activo" : "⛔ Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/admin/paquetes/${p.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                        style={{ backgroundColor: "#0E84C7" }}>
                        Editar
                      </Link>
                      <button onClick={() => duplicar(p)} disabled={duplicando === p.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: "#D9B96E" }}
                        title="Duplicar paquete">
                        {duplicando === p.id ? "..." : "⎘ Copia"}
                      </button>
                      <button onClick={() => eliminar(p.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-500 border border-red-200 hover:bg-red-50">
                        Desactivar
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
