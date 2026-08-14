"use client";

import { useEffect, useState } from "react";

const KEY = "alexa_favoritos";

function getFavs(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useFavoritos() {
  const [favs, setFavs] = useState<number[]>([]);
  useEffect(() => { setFavs(getFavs()); }, []);

  const toggle = (id: number) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { favs, toggle };
}

export default function FavoritoBtn({ paqueteId, className = "" }: { paqueteId: number; className?: string }) {
  const { favs, toggle } = useFavoritos();
  const esFav = favs.includes(paqueteId);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(paqueteId); }}
      title={esFav ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        esFav ? "bg-red-500 text-white shadow-sm" : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-400"
      } ${className}`}
    >
      {esFav ? "♥" : "♡"}
    </button>
  );
}
