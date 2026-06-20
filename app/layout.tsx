import type { Metadata } from "next";
import { Playfair_Display, Urbanist } from "next/font/google";
import "./globals.css";

// Tipografía de display: usada en títulos, cifras y el logotipo.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Tipografía de cuerpo: usada en párrafos, navegación y UI.
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duparc Realty | Gestión Patrimonial Exclusiva en Ciudad del Carmen",
  description:
    "Duparc Realty conecta capital inteligente con las propiedades industriales y residenciales más exclusivas del sureste mexicano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${urbanist.variable}`}
      // Modo oscuro nativo: no depende de la clase "dark" de Tailwind.
    >
      <body className="bg-slate-950 font-body text-slate-50 antialiased selection:bg-gold selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
