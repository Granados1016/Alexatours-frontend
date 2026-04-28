import Hero from "@/components/sections/Hero";
import Destinos from "@/components/sections/Destinos";
import Paquetes from "@/components/sections/Paquetes";
import PorQueNosotros from "@/components/sections/PorQueNosotros";
import Testimonios from "@/components/sections/Testimonios";
import ContactoCTA from "@/components/sections/ContactoCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Destinos />
      <Paquetes />
      <PorQueNosotros />
      <Testimonios />
      <ContactoCTA />
    </>
  );
}
