"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Usa la misma cookie que auth.ts (at_token)
        const match = document.cookie.match(/(?:^|;\s*)at_token=([^;]*)/);
        const token = match ? decodeURIComponent(match[1]) : null;
        if (!token) return;
        const res = await fetch(`${API}/admin/contacto`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const mensajes = Array.isArray(data) ? data : (data.data ?? []);
        setCount(mensajes.filter((m: { leido?: boolean }) => !m.leido).length);
      } catch {
        // Silencia errores de red para no interrumpir la UI
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000); // refresca cada 30 s
    return () => clearInterval(interval);
  }, []);

  return count;
}
