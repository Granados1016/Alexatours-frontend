import Hero from "@/components/sections/Hero";
import Destinos from "@/components/sections/Destinos";
import Paquetes from "@/components/sections/Paquetes";
import PorQueNosotros from "@/components/sections/PorQueNosotros";
import Testimonios from "@/components/sections/Testimonios";
import ContactoCTA from "@/components/sections/ContactoCTA";
import { getSiteConfig, waUrl } from "@/lib/configuracion";

export default async function Home() {
  const config = await getSiteConfig();
  const whatsappUrl = waUrl(config);

  return (
    <>
      <Hero config={config} waUrl={whatsappUrl} />
      <Destinos />
      <Paquetes />
      <PorQueNosotros />
      <Testimonios />
      <ContactoCTA config={config} waUrl={whatsappUrl} />
    </>
  );
}
