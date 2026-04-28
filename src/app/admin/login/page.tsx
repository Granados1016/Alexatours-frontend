"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Credenciales incorrectas");
      const { access_token } = await res.json();

      // Guardar token en cookie vía API route
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: access_token }),
      });

      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0A5D8F 0%, #0E84C7 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-heading text-3xl font-bold">
            <span style={{ color: "#0E84C7" }}>Alexa</span>
            <span style={{ color: "#D9B96E" }}> Tours</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Panel Administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
              placeholder="admin@alexatours.mx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#444" }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 mt-2"
            style={{ backgroundColor: "#0E84C7" }}
          >
            {loading ? "Verificando..." : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
