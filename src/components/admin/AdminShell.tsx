"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fijo en desktop, drawer en móvil */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <header
          className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-white/20 flex-shrink-0"
          style={{ backgroundColor: "#0A5D8F" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-white">
            Alexa <span style={{ color: "#D9B96E" }}>Tours</span>
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
