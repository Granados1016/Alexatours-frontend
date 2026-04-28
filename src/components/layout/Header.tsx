"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/#destinos", label: "Destinos" },
  { href: "/#paquetes", label: "Paquetes" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold" style={{ color: "#0E84C7" }}>
            Alexa
          </span>
          <span className="font-heading text-2xl font-bold" style={{ color: "#D9B96E" }}>
            Tours
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors hover:text-[#0E84C7]"
              style={{ color: "#444444" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/529991234567?text=Hola%2C%20me%20gustaría%20cotizar%20un%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: "#0E84C7" }}
          >
            Cotiza ahora
          </a>
        </nav>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md"
          aria-label="Menú"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-[#444444] transition-transform origin-center ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span className={`block h-0.5 bg-[#444444] transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 bg-[#444444] transition-transform origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Nav móvil */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium"
              style={{ color: "#444444" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/529991234567?text=Hola%2C%20me%20gustaría%20cotizar%20un%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#0E84C7" }}
          >
            Cotiza ahora
          </a>
        </div>
      )}
    </header>
  );
}
