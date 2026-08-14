"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface Reserva {
  id: number;
  nombre: string;
  paqueteNombre: string;
  fechaViaje: string;
  numPersonas: number;
  estado: "pendiente" | "confirmada" | "cancelada";
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEMANA = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const ESTADO_COLOR: Record<string, string> = {
  pendiente: "#F59E0B", confirmada: "#10B981", cancelada: "#EF4444",
};

export default function CalendarioReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoy] = useState(new Date());
  const [mes, setMes] = useState(hoy.getMonth());
  const [año, setAño] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    apiFetch("/admin/reservas").then(setReservas).catch(console.error).finally(() => setLoading(false));
  }, []);

  const reservasMes = reservas.filter((r) => {
    if (!r.fechaViaje) return false;
    const f = new Date(r.fechaViaje + "T12:00:00");
    return f.getMonth() === mes && f.getFullYear() === año;
  });

  const porDia: Record<number, Reserva[]> = {};
  reservasMes.forEach((r) => {
    const dia = new Date(r.fechaViaje + "T12:00:00").getDate();
    if (!porDia[dia]) porDia[dia] = [];
    porDia[dia].push(r);
  });

  const primerDia = new Date(año, mes, 1).getDay();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const celdas = Array(primerDia).fill(null).concat(Array.from({ length: diasEnMes }, (_, i) => i + 1));
  while (celdas.length % 7 !== 0) celdas.push(null);

  const irAntes = () => mes === 0 ? (setMes(11), setAño(a => a - 1)) : setMes(m => m - 1);
  const irDespues = () => mes === 11 ? (setMes(0), setAño(a => a + 1)) : setMes(m => m + 1);

  const reservasDia = diaSeleccionado ? (porDia[diaSeleccionado] ?? []) : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>Calendario de Reservas</h1>
          <p className="text-sm text-gray-400 mt-1">{reservasMes.length} reserva(s) en {MESES[mes]} {año}</p>
        </div>
        <Link href="/admin/reservas"
          className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50">
          ← Lista
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <button onClick={irAntes} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">‹</button>
            <h2 className="font-heading font-bold text-lg" style={{ color: "#0A5D8F" }}>{MESES[mes]} {año}</h2>
            <button onClick={irDespues} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">›</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DIAS_SEMANA.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((dia, i) => {
              if (!dia) return <div key={`e${i}`} />;
              const rDia = porDia[dia] ?? [];
              const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear();
              const sel = dia === diaSeleccionado;
              return (
                <button key={dia} onClick={() => setDiaSeleccionado(sel ? null : dia)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                    ${sel ? "text-white shadow-sm" : esHoy ? "ring-2 ring-[#0E84C7]" : "hover:bg-gray-50"}
                    ${rDia.length > 0 && !sel ? "bg-blue-50" : ""}
                  `}
                  style={sel ? { backgroundColor: "#0A5D8F" } : {}}>
                  <span className={sel ? "text-white" : esHoy ? "text-[#0E84C7] font-bold" : "text-gray-700"}>{dia}</span>
                  {rDia.length > 0 && (
                    <span className={`text-[10px] font-bold ${sel ? "text-white/80" : "text-[#0E84C7]"}`}>{rDia.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          {diaSeleccionado ? (
            <>
              <h3 className="font-heading font-bold text-lg mb-4" style={{ color: "#0A5D8F" }}>
                {diaSeleccionado} de {MESES[mes]}
              </h3>
              {reservasDia.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">Sin reservas este día</p>
                : <div className="space-y-3">
                    {reservasDia.map(r => (
                      <div key={r.id} className="p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold" style={{ color: "#0A5D8F" }}>{r.nombre}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: ESTADO_COLOR[r.estado] }}>{r.estado}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{r.paqueteNombre}</p>
                        <p className="text-xs text-gray-400">{r.numPersonas} persona(s)</p>
                      </div>
                    ))}
                  </div>}
            </>
          ) : (
            <>
              <h3 className="font-heading font-bold text-lg mb-4" style={{ color: "#0A5D8F" }}>{MESES[mes]} — Resumen</h3>
              {loading ? <p className="text-sm text-gray-400">Cargando...</p>
                : reservasMes.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">Sin reservas este mes</p>
                : <div className="space-y-3">
                    {[...reservasMes].sort((a, b) => new Date(a.fechaViaje).getTime() - new Date(b.fechaViaje).getTime()).map(r => (
                      <div key={r.id} className="p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-gray-500">Día {new Date(r.fechaViaje + "T12:00:00").getDate()}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: ESTADO_COLOR[r.estado] }}>{r.estado}</span>
                        </div>
                        <p className="text-sm font-semibold truncate" style={{ color: "#0A5D8F" }}>{r.nombre}</p>
                        <p className="text-xs text-gray-400 truncate">{r.paqueteNombre}</p>
                      </div>
                    ))}
                  </div>}
              <p className="text-xs text-gray-400 text-center mt-4">Haz clic en un día para ver detalles</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
