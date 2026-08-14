"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  hasPass: boolean;
  mailTo: string;
}

const FIELD_INFO: Record<string, string> = {
  host: "Servidor SMTP (ej. smtp.gmail.com, smtp.hostinger.com)",
  port: "Puerto (587 = TLS, 465 = SSL, 25 = sin cifrado)",
  user: "Usuario / correo de envío",
  pass: "Contraseña",
  mailTo: "Correo destino (donde llegan las reservas y mensajes)",
};

export default function ConfiguracionCorreoPage() {
  const [form, setForm] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    mailTo: "",
  });
  const [hasPass, setHasPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    apiFetch("/admin/correo/config")
      .then((data: SmtpConfig) => {
        setForm({
          host: data.host,
          port: data.port,
          secure: data.secure,
          user: data.user,
          pass: "",
          mailTo: data.mailTo,
        });
        setHasPass(data.hasPass);
        setTestEmail(data.mailTo || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const body: Record<string, unknown> = {
        host: form.host,
        port: Number(form.port),
        secure: form.secure,
        user: form.user,
        mailTo: form.mailTo,
      };
      if (form.pass) body.pass = form.pass;

      await apiFetch("/admin/correo/config", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setSaved(true);
      setHasPass(true);
      setForm((f) => ({ ...f, pass: "" }));
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setTesting(true);
    setTestResult(null);
    try {
      await apiFetch("/admin/correo/test", {
        method: "POST",
        body: JSON.stringify({ to: testEmail }),
      });
      setTestResult({ ok: true, msg: `Correo enviado a ${testEmail}` });
    } catch (e: unknown) {
      setTestResult({ ok: false, msg: e instanceof Error ? e.message : "Error al enviar" });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Cargando configuración…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
          Configuración de Correo
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configura el servidor SMTP para el envío de notificaciones y confirmaciones
        </p>
      </div>

      {/* Formulario SMTP */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-base mb-5" style={{ color: "#0A5D8F" }}>
          📡 Servidor SMTP
        </h2>

        <div className="space-y-4">
          {/* Host */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={form.host}
              onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">{FIELD_INFO.host}</p>
          </div>

          {/* Puerto + SSL */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Puerto
              </label>
              <input
                type="number"
                value={form.port}
                onChange={(e) => setForm((f) => ({ ...f, port: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Cifrado SSL/TLS
              </label>
              <div className="flex gap-3 mt-1">
                {[
                  { label: "TLS (puerto 587)", value: false },
                  { label: "SSL (puerto 465)", value: true },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setForm((f) => ({ ...f, secure: opt.value }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      form.secure === opt.value
                        ? "border-[#0E84C7] bg-[#0E84C7]/10 text-[#0A5D8F]"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Usuario / Correo de envío
            </label>
            <input
              type="email"
              value={form.user}
              onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
              placeholder="noreply@alexatours.mx"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={form.pass}
              onChange={(e) => setForm((f) => ({ ...f, pass: e.target.value }))}
              placeholder={hasPass ? "••••••••  (dejar vacío para no cambiar)" : "Contraseña SMTP"}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
            />
            {hasPass && (
              <p className="text-xs text-green-600 mt-1">✓ Contraseña guardada — solo escribe si quieres cambiarla</p>
            )}
          </div>
        </div>
      </section>

      {/* Destino */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-base mb-5" style={{ color: "#0A5D8F" }}>
          📬 Correo destino
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Recibir notificaciones en
          </label>
          <input
            type="email"
            value={form.mailTo}
            onChange={(e) => setForm((f) => ({ ...f, mailTo: e.target.value }))}
            placeholder="admin@alexatours.mx"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">{FIELD_INFO.mailTo}</p>
        </div>
      </section>

      {/* Guardar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ backgroundColor: saving ? "#999" : "#0E84C7" }}
        >
          {saving ? "Guardando…" : saved ? "✓ Configuración guardada" : "Guardar configuración"}
        </button>
        {saveError && <p className="text-sm text-red-500">{saveError}</p>}
      </div>

      {/* Correo de prueba */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-base mb-2" style={{ color: "#0A5D8F" }}>
          🧪 Enviar correo de prueba
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Guarda la configuración antes de probar. Se enviará un correo de prueba a la dirección indicada.
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
          />
          <button
            onClick={handleTest}
            disabled={testing || !testEmail}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#0A5D8F" }}
          >
            {testing ? "Enviando…" : "Enviar prueba"}
          </button>
        </div>
        {testResult && (
          <div
            className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium ${
              testResult.ok
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {testResult.ok ? "✅ " : "❌ "}
            {testResult.msg}
          </div>
        )}
      </section>
    </div>
  );
}
