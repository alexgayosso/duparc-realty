import Link from "next/link";
import { Search, TrendingUp, type LucideIcon } from "lucide-react";

export default function DoubleFunnel() {
  return (
    <section className="relative overflow-hidden bg-stone-50 px-6 py-24">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-sm border border-stone-200 bg-white sm:grid sm:grid-cols-2 sm:divide-x sm:divide-stone-200">
        <FunnelCard
          icon={Search}
          eyebrow="Compradores"
          title="Encuentre su nuevo activo"
          description="Un portafolio curado de propiedades industriales y residenciales en las ubicaciones más estratégicas de Ciudad del Carmen y la región."
          ctaLabel="Explorar Propiedades"
          ctaHref="/propiedades"
        />
        <FunnelCard
          icon={TrendingUp}
          eyebrow="Propietarios"
          title="¿Conoce el valor real de su propiedad?"
          description="Solicite un avalúo discreto y una estrategia de venta diseñada para proteger su privacidad y maximizar su retorno."
          ctaLabel="Vender con Duparc"
          ctaHref="/vende-tu-propiedad"
          emphasized
        />
      </div>
    </section>
  );
}

function FunnelCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  emphasized = false,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-6 p-10 sm:p-14 ${
        emphasized ? "bg-stone-50" : "bg-white"
      }`}
    >
      <Icon size={28} className="text-accent-600" strokeWidth={1.5} />
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl leading-tight text-stone-900 sm:text-3xl">
        {title}
      </h2>
      <p className="font-body text-sm leading-relaxed text-stone-600 sm:text-base">
        {description}
      </p>

      <Link
        href={ctaHref}
        className={
          emphasized
            ? "mt-2 inline-flex w-fit items-center justify-center rounded-sm bg-accent-600 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent-700"
            : "mt-2 inline-flex w-fit items-center justify-center rounded-sm border border-accent-600 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
        }
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
