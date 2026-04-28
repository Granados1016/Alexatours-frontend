"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface Stats {
  paquetes: number;
  destinos: number;
  clientes: number;
  reservas: number;
  ultimosClientes: { id: number; nombre: string; email: string; telefono: string; ciudad: string; createdAt: string }[];
}

const statCards = [
  { key: "paquetes", label: "Paquetes activos", icon: "✈️", href: "/admin/paquetes", color: "#0E84C7" },
  { key: "destinos", label: "Destinos", icon: "🌍", href: "/admin/destinos", color: "#0A5D8F" },
  { key: "clientes", label: "Leads / Clientes", icon: "👥", href: "/admin/clientes", color: "#D9B96E" },
  { key: "reservas", label: "Reservas", icon: "📋", href: "#", color: "#444444" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/stats")
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">Resumen general de Alexa Tours</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.map((card) => (
          <Link href={card.href} key={card.key}>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: card.color }}
                >
                  Ver
                </span>
              </div>
              <p
                className="font-heading text-4xl font-bold"
                style={{ color: card.color }}
              >
                {loading ? "—" : (stats?.[card.key as keyof Omit<Stats, "ultimosClientes">] as number) ?? 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos clientes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base" style={{ color: "#0A5D8F" }}>
              Últimos leads recibidos
            </h2>
            <Link
              href="/admin/clientes"
              className="text-xs font-medium"
              style={{ color: "#0E84C7" }}
            >
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : stats?.ultimosClientes.length === 0 ? (
            <p className="text-sm text-gray-400">Aún no hay clientes registrados.</p>
          ) : (
            <div className="space-y-3">
              {stats?.ultimosClientes.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#444" }}>{c.nombre}</p>
                    <p className="text-xs text-gray-400">{c.email || c.telefono || "Sin contacto"}</p>
                  </div>
                  <p className="text-xs text-gray-300">
                    {new Date(c.createdAt).toLocaleDateString("es-MX")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-base mb-5" style={{ color: "#0A5D8F" }}>
            Acciones rápidas
          </h2>
          <div className="space-y-3">
            {[
              { href: "/admin/paquetes/nuevo", label: "➕ Agregar nuevo paquete", color: "#0E84C7" },
              { href: "/admin/destinos/nuevo", label: "🌍 Agregar nuevo destino", color: "#0A5D8F" },
              { href: "/", label: "🌐 Ver sitio público", color: "#D9B96E" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                target={a.href === "/" ? "_blank" : undefined}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: a.color }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
