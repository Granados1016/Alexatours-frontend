"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { SiteConfig } from "@/lib/configuracion";

interface Props {
  waUrl: string;
  config: SiteConfig;
  children: React.ReactNode;
}

export default function PublicLayout({ waUrl, config, children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header waUrl={waUrl} />
      <main className="flex-1">{children}</main>
      <Footer config={config} waUrl={waUrl} />
      <WhatsAppFloat waUrl={waUrl} mensaje="Hola! 👋 Estoy en la web de Alexa Tours y me gustaría obtener más información sobre sus paquetes de viaje." />
    </>
  );
}
