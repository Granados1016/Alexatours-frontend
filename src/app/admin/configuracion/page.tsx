"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";

interface Setting {
  clave: string;
  valor: string;
  grupo: string;
  etiqueta: string;
  tipo: "text" | "textarea" | "url" | "tel" | "email" | "color" | "image";
}

const GROUP_LABELS: Record<string, string> = {
  contacto: "📞 Información de Contacto",
  redes: "📱 Redes Sociales",
  hero: "🖼️ Sección Hero (portada)",
  general: "🏢 Información General",
};

const GROUP_ORDER = ["general", "hero", "contacto", "redes"];

export default function AdminConfiguracionPage() {
  const [rows, setRows] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/admin/configuracion")
      .then((data: Setting[]) => {
        setRows(data);
        setValues(Object.fromEntries(data.map((r) => [r.clave, r.valor ?? ""])));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (clave: string, val: string) => {
    setValues((prev) => ({ ...prev, [clave]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch("/admin/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Group rows by grupo, in defined order
  const grouped = GROUP_ORDER.reduce<Record<string, Setting[]>>((acc, g) => {
    const items = rows.filter((r) => r.grupo === g);
    if (items.length) acc[g] = items;
    return acc;
  }, {});
  // Append any unlisted groups
  rows.forEach((r) => {
    if (!GROUP_ORDER.includes(r.grupo) && r.grupo) {
      if (!grouped[r.grupo]) grouped[r.grupo] = [];
      if (!grouped[r.grupo].includes(r)) grouped[r.grupo].push(r);
    }
  });

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "#0A5D8F" }}>
            Configuración del Sitio
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Modifica textos, imágenes y datos de contacto del sitio público
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ backgroundColor: saving ? "#999" : "#0E84C7" }}
        >
          {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando configuración…</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([grupo, settings]) => (
            <section key={grupo} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-base mb-5" style={{ color: "#0A5D8F" }}>
                {GROUP_LABELS[grupo] ?? grupo}
              </h2>
              <div className="space-y-5">
                {settings.map((s) => (
                  <div key={s.clave}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {s.etiqueta}
                    </label>

                    {s.tipo === "image" ? (
                      <ImageUpload
                        value={values[s.clave] ?? ""}
                        onChange={(url) => handleChange(s.clave, url)}
                      />
                    ) : s.tipo === "textarea" ? (
                      <textarea
                        rows={3}
                        value={values[s.clave] ?? ""}
                        onChange={(e) => handleChange(s.clave, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] resize-none transition-colors"
                      />
                    ) : (
                      <input
                        type={s.tipo}
                        value={values[s.clave] ?? ""}
                        onChange={(e) => handleChange(s.clave, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0E84C7] transition-colors"
                      />
                    )}

                    {/* Preview for URLs / images */}
                    {s.tipo === "url" && values[s.clave] && (
                      <a
                        href={values[s.clave]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0E84C7] hover:underline mt-1 block"
                      >
                        {values[s.clave]}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom save button */}
          <div className="flex justify-end pb-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: saving ? "#999" : "#0E84C7" }}
            >
              {saving ? "Guardando…" : saved ? "✓ Cambios guardados" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
