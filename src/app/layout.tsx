import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexa Tours — Viajes para Recordar",
  description:
    "Agencia de viajes del sureste de México. Paquetes a Cancún, Punta Cana, París y más. Salidas desde Campeche con atención personalizada.",
  keywords: "agencia de viajes, Campeche, Cancún, paquetes turísticos, viajes México",
  openGraph: {
    title: "Alexa Tours — Viajes para Recordar",
    description: "Tu próxima aventura comienza aquí. Viajes seguros y memorables.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
