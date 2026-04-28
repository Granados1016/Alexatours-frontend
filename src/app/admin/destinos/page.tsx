"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface Destino {
  id: number; nombre: string; pais: string; imagenUrl: string; activo: boolean;
}

export default function AdminDestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    apiFetch("/destinos").then(setDestinos).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id: number) => {
    if (!confirm("¿Desactivar este destino?")) return;
    await apiFetch(`/destinos/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Destinos</h1>
          <p className="text-sm text-gray-400 mt-1">{destinos.length} destinos registrados</p>
        </div>
        <Link href="/admin/destinos/nuevo"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#0E84C7" }}>
          ➕ Nuevo destino
        </Link>
      </div>

      {loading ? <p className="text-gray-400">Cargando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {destinos.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-36 overflow-hidden">
                {d.imagenUrl
                  ? <img src={d.imagenUrl} alt={d.nombre} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl">🌍</div>
                }
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: "#0A5D8F" }}>{d.nombre}</p>
                    <p className="text-xs text-gray-400">{d.pais}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                    {d.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/destinos/${d.id}`}
                    className="flex-1 text-center text-xs py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#0E84C7" }}>
                    Editar
                  </Link>
                  <button onClick={() => eliminar(d.id)}
                    className="flex-1 text-xs py-2 rounded-lg font-medium text-red-500 border border-red-200 hover:bg-red-50">
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
