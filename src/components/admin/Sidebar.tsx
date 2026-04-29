"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/paquetes", label: "Paquetes", icon: "✈️", exact: false },
  { href: "/admin/destinos", label: "Destinos", icon: "🌍", exact: false },
  { href: "/admin/clientes", label: "Clientes", icon: "👥", exact: false },
  { href: "/admin/configuracion", label: "Configuración", icon: "⚙️", exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <aside
      className="w-60 min-h-screen flex flex-col shadow-lg"
      style={{ backgroundColor: "#0A5D8F" }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <Link href="/admin">
          <p className="font-heading text-xl font-bold">
            <span className="text-white">Alexa</span>
            <span style={{ color: "#D9B96E" }}> Tours</span>
          </p>
          <p className="text-xs text-white/50 mt-0.5">Panel Admin</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <span>🌐</span> Ver sitio público
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
