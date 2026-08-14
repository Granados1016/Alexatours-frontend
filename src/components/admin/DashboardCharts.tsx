"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

interface ChartData {
  reservasPorMes: { mes: string; reservas: number; ingresos: number }[];
  reservasPorEstado: { estado: string; total: number }[];
  topPaquetes: { nombre: string; total: number }[];
  leadsPorMes: { mes: string; leads: number }[];
}

const COLORES_ESTADO: Record<string, string> = {
  pendiente: "#F59E0B",
  confirmada: "#10B981",
  cancelada: "#EF4444",
  completada: "#0E84C7",
};

const COLORES_PIE = ["#F59E0B", "#10B981", "#EF4444", "#0E84C7"];

const formatPeso = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

interface Props {
  data: ChartData;
}

export default function DashboardCharts({ data }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      {/* Reservas por mes */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#0A5D8F" }}>
          📈 Reservas últimos 6 meses
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.reservasPorMes} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} />
            <YAxis tick={{ fontSize: 12, fill: "#888" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(v) => [v as number, "Reservas"]}
            />
            <Bar dataKey="reservas" fill="#0E84C7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ingresos por mes */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#0A5D8F" }}>
          💰 Ingresos últimos 6 meses (MXN)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.reservasPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} />
            <YAxis tickFormatter={formatPeso} tick={{ fontSize: 12, fill: "#888" }} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(v) => [`$${(v as number).toLocaleString("es-MX")}`, "Ingresos"]}
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#D9B96E"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#D9B96E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reservas por estado */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#0A5D8F" }}>
          📊 Reservas por estado
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data.reservasPorEstado.filter((e) => e.total > 0)}
              dataKey="total"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={75}
              label={(props) => { const p = props as unknown as { estado?: string; total?: number }; return (p.total ?? 0) > 0 ? `${p.estado} (${p.total})` : ""; }}
              labelLine={false}
            >
              {data.reservasPorEstado.map((entry, index) => (
                <Cell
                  key={entry.estado}
                  fill={COLORES_ESTADO[entry.estado] || COLORES_PIE[index % COLORES_PIE.length]}
                />
              ))}
            </Pie>
            <Legend
              formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              iconType="circle"
              iconSize={8}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top paquetes */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#0A5D8F" }}>
          🏆 Top paquetes más solicitados
        </h2>
        {data.topPaquetes.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">Aún no hay reservas</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topPaquetes} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="nombre"
                width={110}
                tick={{ fontSize: 11, fill: "#555" }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v) => [v as number, "Reservas"]}
              />
              <Bar dataKey="total" fill="#0A5D8F" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leads por mes */}
      <div className="bg-white rounded-2xl shadow-sm p-6 xl:col-span-2">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#0A5D8F" }}>
          👥 Nuevos leads por mes
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.leadsPorMes} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} />
            <YAxis tick={{ fontSize: 12, fill: "#888" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(v) => [v as number, "Leads"]}
            />
            <Bar dataKey="leads" fill="#D9B96E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
