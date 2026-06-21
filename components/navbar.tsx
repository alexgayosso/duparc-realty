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
      className={`fixed inset-x-0 top-0 z-50 border-b bg-stone-50/95 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled
          ? "border-stone-200 shadow-[0_2px_16px_-4px_rgba(28,25,23,0.08)]"
          : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Logo oficial de Duparc Realty */}
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-duparc.png"
            alt="Duparc Realty"
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        {/* Navegación desktop */}
        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm font-medium uppercase tracking-[0.1em] text-stone-600 transition-colors hover:text-accent-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/vende-tu-propiedad"
          className="hidden rounded-sm bg-accent-600 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-700 lg:inline-block"
        >
          Valora tu Propiedad
        </Link>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="text-stone-900 lg:hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-body text-sm font-medium uppercase tracking-[0.1em] text-stone-600 hover:text-accent-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vende-tu-propiedad"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 inline-block rounded-sm bg-accent-600 px-5 py-2.5 text-center font-body text-xs font-semibold uppercase tracking-[0.12em] text-white"
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
