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
    <form className="flex w-full flex-col overflow-hidden rounded-sm border border-stone-300 bg-white sm:flex-row">
      <Segment label="Operación">
        <select className="select-field" defaultValue={OPERATIONS[0]}>
          {OPERATIONS.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Tipo" border>
        <select className="select-field" defaultValue={PROPERTY_TYPES[0]}>
          {PROPERTY_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Zona" border>
        <select className="select-field" defaultValue={ZONES[0]}>
          {ZONES.map((zone) => (
            <option key={zone}>{zone}</option>
          ))}
        </select>
      </Segment>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-accent-600 px-7 py-4 font-body text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-700"
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
  border = false,
}: {
  label: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <label
      className={`relative flex flex-1 items-center gap-3 px-5 py-4 ${
        border ? "sm:border-l sm:border-stone-200" : ""
      }`}
    >
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
        {label}
      </span>
      <div className="relative flex-1">
        {children}
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-stone-400"
        />
      </div>
    </label>
  );
}
