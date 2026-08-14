"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Resultado {
  tipo: "paquete" | "destino" | "blog";
  id: number | string;
  titulo: string;
  subtitulo?: string;
  href: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BusquedaGlobal() {
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Abrir con Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setAbierto((v) => !v);
      }
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (abierto) setTimeout(() => inputRef.current?.focus(), 50);
  }, [abierto]);

  // Buscar con debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) { setResultados([]); return; }

    timerRef.current = setTimeout(async () => {
      setCargando(true);
      try {
        const q = query.toLowerCase();
        const [paquetes, destinos, blog] = await Promise.all([
          fetch(`${API}/paquetes`, { cache: "no-store" }).then(r => r.json()).catch(() => []),
          fetch(`${API}/destinos`, { cache: "no-store" }).then(r => r.json()).catch(() => []),
          fetch(`${API}/blog?limit=50`, { cache: "no-store" }).then(r => r.json()).then(d => Array.isArray(d) ? d : d.data ?? []).catch(() => []),
        ]);

        const res: Resultado[] = [];

        (Array.isArray(paquetes) ? paquetes : []).filter((p: { nombre: string; destino?: { nombre: string } }) =>
          p.nombre?.toLowerCase().includes(q)
        ).slice(0, 3).forEach((p: { id: number; nombre: string; destino?: { nombre: string } }) => res.push({
          tipo: "paquete", id: p.id, titulo: p.nombre,
          subtitulo: p.destino?.nombre, href: `/paquetes/${p.id}`,
        }));

        (Array.isArray(destinos) ? destinos : []).filter((d: { nombre: string }) =>
          d.nombre?.toLowerCase().includes(q)
        ).slice(0, 3).forEach((d: { id: number; nombre: string; pais?: string }) => res.push({
          tipo: "destino", id: d.id, titulo: d.nombre,
          subtitulo: d.pais, href: `/destinos/${d.id}`,
        }));

        (Array.isArray(blog) ? blog : []).filter((a: { titulo: string }) =>
          a.titulo?.toLowerCase().includes(q)
        ).slice(0, 3).forEach((a: { id: number; slug: string; titulo: string; categoria?: string }) => res.push({
          tipo: "blog", id: a.id, titulo: a.titulo,
          subtitulo: a.categoria, href: `/blog/${a.slug}`,
        }));

        setResultados(res);
      } finally {
        setCargando(false);
      }
    }, 300);
  }, [query]);

  const TIPO_LABEL: Record<string, string> = { paquete: "✈️ Paquete", destino: "🌍 Destino", blog: "📝 Blog" };
  const TIPO_COLOR: Record<string, string> = { paquete: "#0E84C7", destino: "#10B981", blog: "#8B5CF6" };

  if (!abierto) return (
    <button
      onClick={() => setAbierto(true)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-all bg-white/50 hover:bg-white"
      title="Buscar (Ctrl+K)"
    >
      <span>🔍</span>
      <span className="hidden sm:inline text-xs">Buscar</span>
      <kbd className="hidden sm:inline text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setAbierto(false); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <span className="text-gray-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar paquetes, destinos, artículos..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          {cargando && <span className="text-xs text-gray-400 animate-pulse">Buscando...</span>}
          <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
        </div>

        {/* Resultados */}
        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto">
            {resultados.length === 0 && !cargando ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin resultados para "{query}"</p>
            ) : (
              <div className="py-2">
                {resultados.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    onClick={() => setAbierto(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ backgroundColor: `${TIPO_COLOR[r.tipo]}15`, color: TIPO_COLOR[r.tipo] }}>
                      {TIPO_LABEL[r.tipo]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#0A5D8F" }}>{r.titulo}</p>
                      {r.subtitulo && <p className="text-xs text-gray-400 truncate">{r.subtitulo}</p>}
                    </div>
                    <span className="ml-auto text-gray-300 flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-gray-400">Escribe al menos 2 caracteres para buscar</p>
            <div className="flex justify-center gap-3 mt-4">
              {[{ label: "Paquetes", href: "/paquetes" }, { label: "Destinos", href: "/destinos" }, { label: "Ofertas", href: "/ofertas" }].map(l => (
                <Link key={l.href} href={l.href} onClick={() => setAbierto(false)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
