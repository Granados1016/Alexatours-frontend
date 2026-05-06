"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
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
    </>
  );
}
