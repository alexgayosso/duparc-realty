"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Zonas Prime", href: "#zonas-prime" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gold/15 bg-slate-950/90 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl tracking-[0.18em] text-slate-50 transition-colors group-hover:text-gold sm:text-2xl">
            DUPARC
          </span>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] text-gold sm:text-xs">
            REALTY
          </span>
        </Link>

        {/* Navegación desktop */}
        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm font-medium uppercase tracking-[0.12em] text-slate-300 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/vende-tu-propiedad"
          className="hidden rounded-sm border border-gold/60 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-slate-950 lg:inline-block"
        >
          Valora tu Propiedad
        </Link>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="text-slate-50 lg:hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-body text-sm font-medium uppercase tracking-[0.12em] text-slate-300 hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vende-tu-propiedad"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 inline-block rounded-sm border border-gold/60 px-5 py-2.5 text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold"
              >
                Valora tu Propiedad
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
