import { Award, Building2, ShieldCheck, TrendingUp } from "lucide-react";

const STATS = [
  {
    icon: Award,
    value: "+10",
    label: "Años de Experiencia",
  },
  {
    icon: Building2,
    value: "Premium",
    label: "Inventario Exclusivo",
  },
  {
    icon: ShieldCheck,
    value: "Integral",
    label: "Asesoría Legal",
  },
  {
    icon: TrendingUp,
    value: "Estratégico",
    label: "Capital Inteligente",
  },
];

export default function CredibilitySection() {
  return (
    <section className="relative border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:divide-x sm:divide-stone-200">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 px-4 text-center"
            >
              <Icon size={22} className="text-accent-600" strokeWidth={1.75} />
              <span className="font-display text-2xl text-stone-900 sm:text-3xl">
                {value}
              </span>
              <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
