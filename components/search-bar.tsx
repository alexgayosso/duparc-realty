import { ChevronDown, Search } from "lucide-react";

const OPERATIONS = ["Comprar", "Rentar"];
const PROPERTY_TYPES = [
  "Residencial",
  "Industrial / Bodegas",
  "Comercial",
  "Terrenos",
];
const ZONES = [
  "Ciudad del Carmen",
  "Isla del Carmen · Centro",
  "Carretera Costera",
  "Riviera Maya, Q. Roo",
];

export default function SearchBar() {
  return (
    <form className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-sm border border-white/10 bg-slate-950/70 p-3 backdrop-blur-md sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-full sm:p-2">
      <Segment label="Operación">
        <select className="select-field" defaultValue={OPERATIONS[0]}>
          {OPERATIONS.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Tipo">
        <select className="select-field" defaultValue={PROPERTY_TYPES[0]}>
          {PROPERTY_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Zona">
        <select className="select-field" defaultValue={ZONES[0]}>
          {ZONES.map((zone) => (
            <option key={zone}>{zone}</option>
          ))}
        </select>
      </Segment>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition-colors hover:bg-gold-300 sm:rounded-full"
      >
        <Search size={17} strokeWidth={2.5} />
        Buscar
      </button>
    </form>
  );
}

function Segment({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex flex-1 items-center gap-3 px-5 py-2.5 sm:border-r sm:border-white/10">
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <div className="relative flex-1">
        {children}
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </label>
  );
}
