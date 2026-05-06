"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const navSections = [
  {
    label: "Principal",
    items: [
      { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/paquetes", label: "Paquetes", icon: "✈️", exact: false },
      { href: "/admin/destinos", label: "Destinos", icon: "🌍", exact: false },
      { href: "/admin/blog", label: "Blog", icon: "📝", exact: false },
      { href: "/admin/testimonios", label: "Testimonios", icon: "⭐", exact: false },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/admin/mensajes", label: "Mensajes", icon: "📧", exact: false },
      { href: "/admin/clientes", label: "Clientes", icon: "👥", exact: false },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/configuracion", label: "Configuración", icon: "⚙️", exact: false },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const unreadCount = useUnreadMessages();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="w-60 min-h-screen flex flex-col shadow-lg"
      style={{ backgroundColor: "#0A5D8F" }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex-shrink-0">
        <Link href="/admin">
          <p className="font-heading text-xl font-bold">
            <span className="text-white">Alexa</span>
            <span style={{ color: "#D9B96E" }}> Tours</span>
          </p>
          <p className="text-xs text-white/50 mt-0.5">Panel Admin</p>
        </Link>
      </div>

      {/* Nav con scroll */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-4 mb-1">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    {item.label === "Mensajes" && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — siempre visible */}
      <div className="px-4 py-4 border-t border-white/10 space-y-1 flex-shrink-0">
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
