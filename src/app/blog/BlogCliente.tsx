"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Articulo {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  imagen_portada: string;
  categoria: string;
  tags: string[];
  publicado_en: string;
  created_at: string;
}

const POR_PAGINA = 9;

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function BlogCliente({ articulos }: { articulos: Articulo[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [pagina, setPagina] = useState(1);

  const categorias = useMemo(() => {
    const cats = Array.from(new Set(articulos.map((a) => a.categoria).filter(Boolean)));
    return ["Todas", ...cats];
  }, [articulos]);

  const filtrados = useMemo(() => {
    return articulos.filter((a) => {
      const matchCat = categoriaActiva === "Todas" || a.categoria === categoriaActiva;
      const q = busqueda.toLowerCase();
      const matchBusq = !q || a.titulo.toLowerCase().includes(q) || a.resumen?.toLowerCase().includes(q);
      return matchCat && matchBusq;
    });
  }, [articulos, busqueda, categoriaActiva]);

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const cambiarFiltro = (cat: string) => {
    setCategoriaActiva(cat);
    setPagina(1);
  };

  const cambiarBusqueda = (v: string) => {
    setBusqueda(v);
    setPagina(1);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      {/* Hero */}
      <section className="py-20 text-center" style={{ backgroundColor: "#0A5D8F" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Blog de <span style={{ color: "#D9B96E" }}>Viajes</span>
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
          Guías, consejos e inspiración para tu próxima aventura
        </p>
        {/* Buscador */}
        <div className="max-w-md mx-auto px-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              placeholder="Buscar artículos..."
              value={busqueda}
              onChange={(e) => cambiarBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full text-sm outline-none shadow"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Filtros por categoría */}
        {categorias.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => cambiarFiltro(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaActiva === cat
                    ? "text-white shadow-sm"
                    : "bg-white text-gray-500 hover:text-[#0A5D8F] border border-gray-200"
                }`}
                style={categoriaActiva === cat ? { backgroundColor: "#0A5D8F" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Resultados */}
        <p className="text-xs text-gray-400 mb-6 text-center">
          {filtrados.length} artículo{filtrados.length !== 1 ? "s" : ""}
          {categoriaActiva !== "Todas" ? ` en "${categoriaActiva}"` : ""}
          {busqueda ? ` para "${busqueda}"` : ""}
        </p>

        {paginados.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-xl mb-4">
              {busqueda || categoriaActiva !== "Todas"
                ? "No hay artículos con ese filtro"
                : "Próximamente publicaremos artículos"}
            </p>
            {(busqueda || categoriaActiva !== "Todas") && (
              <button
                onClick={() => { setBusqueda(""); setCategoriaActiva("Todas"); }}
                className="text-sm underline"
                style={{ color: "#0E84C7" }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginados.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      {a.imagen_portada ? (
                        <img
                          src={a.imagen_portada}
                          alt={a.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl"
                          style={{ backgroundColor: "#E8F4FD" }}>
                          ✈️
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {a.categoria && (
                        <button
                          onClick={(e) => { e.preventDefault(); cambiarFiltro(a.categoria); }}
                          className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: "#E8F4FD", color: "#0A5D8F" }}
                        >
                          {a.categoria}
                        </button>
                      )}
                      <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity"
                        style={{ color: "#0A5D8F" }}>
                        {a.titulo}
                      </h2>
                      {a.resumen && (
                        <p className="text-gray-500 text-sm line-clamp-3 flex-1">{a.resumen}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatFecha(a.publicado_en || a.created_at)}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: "#0E84C7" }}>
                          Leer más →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-30 hover:bg-white transition-colors"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPagina(n)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      n === pagina
                        ? "text-white shadow-sm"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-[#0E84C7]"
                    }`}
                    style={n === pagina ? { backgroundColor: "#0A5D8F" } : {}}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-30 hover:bg-white transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
