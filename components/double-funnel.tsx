import Link from "next/link";
import { Search, TrendingUp, type LucideIcon } from "lucide-react";

export default function DoubleFunnel() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-sm border border-slate-800 sm:grid sm:grid-cols-2 sm:divide-x sm:divide-slate-800">
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
        emphasized ? "bg-slate-900" : "bg-slate-900/50"
      }`}
    >
      <Icon size={28} className="text-gold" strokeWidth={1.5} />
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl leading-tight text-slate-50 sm:text-3xl">
        {title}
      </h2>
      <p className="font-body text-sm leading-relaxed text-slate-300 sm:text-base">
        {description}
      </p>

      <Link
        href={ctaHref}
        className={
          emphasized
            ? "mt-2 inline-flex w-fit items-center justify-center rounded-sm bg-gold px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-gold-300"
            : "mt-2 inline-flex w-fit items-center justify-center rounded-sm border border-gold/60 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-slate-950"
        }
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
