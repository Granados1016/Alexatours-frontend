"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";
import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("@/components/admin/DashboardCharts"), { ssr: false });

interface Stats {
  paquetes: number;
  destinos: number;
  clientes: number;
  reservas: number;
  ultimosClientes: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    ciudad: string;
    createdAt: string;
  }[];
}

interface ChartData {
  reservasPorMes: { mes: string; reservas: number; ingresos: number }[];
  reservasPorEstado: { estado: string; total: number }[];
  topPaquetes: { nombre: string; total: number }[];
  leadsPorMes: { mes: string; leads: number }[];
}

interface DashboardData {
  stats: Stats;
  mensajesSinLeer: number;
  articulosPublicados: number;
  articulosBorrador: number;
  testimoniosActivos: number;
  charts: ChartData | null;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [stats, blogRes, testimoniosRes, contactoRes, charts] = await Promise.all([
          apiFetch("/admin/stats"),
          apiFetch("/admin/blog"),
          apiFetch("/admin/testimonios"),
          apiFetch("/admin/contacto"),
          apiFetch("/admin/charts").catch(() => null),
        ]);

        const articulos: { publicado?: boolean; estado?: string }[] = Array.isArray(blogRes)
          ? blogRes
          : (blogRes.data ?? []);
        const articulosPublicados = articulos.filter(
          (a) => a.publicado === true || a.estado === "publicado"
        ).length;
        const articulosBorrador = articulos.length - articulosPublicados;

        const testimonios: { activo?: boolean }[] = Array.isArray(testimoniosRes)
          ? testimoniosRes
          : (testimoniosRes.data ?? []);
        const testimoniosActivos = testimonios.filter((t) => t.activo !== false).length;

        const mensajes: { leido?: boolean }[] = Array.isArray(contactoRes)
          ? contactoRes
          : (contactoRes.data ?? []);
        const mensajesSinLeer = mensajes.filter((m) => !m.leido).length;

        setData({
          stats,
          mensajesSinLeer,
          articulosPublicados,
          articulosBorrador,
          testimoniosActivos,
          charts,
        });
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topCards = [
    { key: "mensajesSinLeer", label: "Mensajes sin leer", icon: "📧", href: "/admin/mensajes", color: "#DC2626", badge: true, value: data?.mensajesSinLeer ?? 0 },
    { key: "articulosPublicados", label: "Artículos publicados", icon: "📝", href: "/admin/blog", color: "#0A5D8F", badge: false, value: data?.articulosPublicados ?? 0 },
    { key: "articulosBorrador", label: "Artículos en borrador", icon: "📄", href: "/admin/blog", color: "#0E84C7", badge: false, value: data?.articulosBorrador ?? 0 },
    { key: "testimoniosActivos", label: "Testimonios activos", icon: "⭐", href: "/admin/testimonios", color: "#D9B96E", badge: false, value: data?.testimoniosActivos ?? 0 },
  ];

  const statCards = [
    { key: "paquetes", label: "Paquetes activos", icon: "✈️", href: "/admin/paquetes", color: "#0E84C7" },
    { key: "destinos", label: "Destinos", icon: "🌍", href: "/admin/destinos", color: "#0A5D8F" },
    { key: "clientes", label: "Leads / Clientes", icon: "👥", href: "/admin/clientes", color: "#D9B96E" },
    { key: "reservas", label: "Reservas", icon: "📋", href: "/admin/reservas", color: "#444444" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">Resumen general de Alexa Tours</p>
      </div>

      {/* Cards contenido */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {topCards.map((card) => (
          <Link href={card.href} key={card.key}>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: card.color }}>
                  Ver
                </span>
              </div>
              <div className="flex items-end gap-2">
                <p className="font-heading text-4xl font-bold" style={{ color: card.color }}>
                  {loading ? "—" : card.value}
                </p>
                {card.badge && !loading && card.value > 0 && (
                  <span className="mb-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {card.value > 99 ? "99+" : card.value}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Cards stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <Link href={card.href} key={card.key}>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: card.color }}>
                  Ver
                </span>
              </div>
              <p className="font-heading text-4xl font-bold" style={{ color: card.color }}>
                {loading ? "—" : ((data?.stats?.[card.key as keyof Omit<Stats, "ultimosClientes">] as number) ?? 0)}
              </p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Gráficas */}
      {!loading && data?.charts && <DashboardCharts data={data.charts} />}

      {/* Fila inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Últimos clientes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base" style={{ color: "#0A5D8F" }}>
              Últimos leads recibidos
            </h2>
            <Link href="/admin/clientes" className="text-xs font-medium" style={{ color: "#0E84C7" }}>
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : data?.stats?.ultimosClientes?.length === 0 ? (
            <p className="text-sm text-gray-400">Aún no hay clientes registrados.</p>
          ) : (
            <div className="space-y-3">
              {data?.stats?.ultimosClientes?.map((c) => (
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
          <h2 className="font-semibold text-base mb-5" style={{ color: "#0A5D8F" }}>Acciones rápidas</h2>
          <div className="space-y-3">
            {[
              { href: "/admin/paquetes/nuevo", label: "➕ Agregar nuevo paquete", color: "#0E84C7" },
              { href: "/admin/destinos/nuevo", label: "🌍 Agregar nuevo destino", color: "#0A5D8F" },
              { href: "/admin/blog/nuevo", label: "📝 Nuevo artículo de blog", color: "#444444" },
              { href: "/admin/usuarios", label: "👤 Gestionar usuarios", color: "#6B7280" },
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
