"use client";

interface Props {
  url: string;
  titulo: string;
  compact?: boolean;
}

export default function ShareButtons({ url, titulo, compact = false }: Props) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(titulo);

  const redes = [
    {
      nombre: "WhatsApp",
      color: "#25D366",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.526 5.854L.057 23.57a.75.75 0 00.921.921l5.716-1.469A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    },
    {
      nombre: "Facebook",
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
      href: `https://facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      nombre: "X / Twitter",
      color: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
    },
    {
      nombre: "Telegram",
      color: "#0088CC",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/>
        </svg>
      ),
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
    },
  ];

  if (compact) {
    return (
      <div className="flex gap-2">
        {redes.map((r) => (
          <a
            key={r.nombre}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Compartir en ${r.nombre}`}
            className="p-2 rounded-full text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: r.color }}
          >
            {r.icon}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {redes.map((r) => (
        <a
          key={r.nombre}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: r.color }}
        >
          {r.icon}
          {r.nombre}
        </a>
      ))}
    </div>
  );
}
