const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getPaquetes() {
  const res = await fetch(`${API_URL}/paquetes`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Error al obtener paquetes");
  return res.json();
}

export async function getPaquetesDestacados() {
  const res = await fetch(`${API_URL}/paquetes/destacados`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Error al obtener paquetes destacados");
  return res.json();
}

export async function getDestinos() {
  const res = await fetch(`${API_URL}/destinos`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error("Error al obtener destinos");
  return res.json();
}

export async function crearCliente(data: {
  nombre: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  mensaje?: string;
}) {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar el formulario");
  return res.json();
}
