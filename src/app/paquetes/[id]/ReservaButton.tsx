"use client";

import { useState } from "react";
import ReservaModal from "@/components/ReservaModal";

interface Props {
  paqueteId: number;
  paqueteNombre: string;
  precio: number;
}

export default function ReservaButton({ paqueteId, paqueteNombre, precio }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md mb-3"
        style={{ backgroundColor: "#0A5D8F" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Reservar ahora
      </button>

      <ReservaModal
        paqueteId={paqueteId}
        paqueteNombre={paqueteNombre}
        precio={precio}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
