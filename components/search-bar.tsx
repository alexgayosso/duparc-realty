import { ChevronDown, Search } from "lucide-react";

const OPERATIONS = ["Comprar", "Rentar"];

// Alineado a las categorías reales de tu cuenta de EasyBroker
// (verificado contra duparcrealty.easybroker.com).
const PROPERTY_TYPES = [
  "Casa",
  "Departamento",
  "Bodega industrial",
  "Nave industrial",
  "Terreno",
  "Local comercial",
];

const ZONES = [
  "Ciudad del Carmen",
  "Isla del Carmen",
  "Carretera Costera",
  "Riviera Maya",
];

export default function SearchBar() {
  return (
    <form
      action="/propiedades"
      method="get"
      className="flex w-full flex-col overflow-hidden rounded-sm border border-stone-300 bg-white sm:flex-row"
    >
      <Segment label="Operación">
        <select name="operacion" className="select-field" defaultValue={OPERATIONS[0]}>
          {OPERATIONS.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Tipo" border>
        <select name="tipo" className="select-field" defaultValue="">
          <option value="">Todos</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Segment>

      <Segment label="Zona" border>
        <select name="zona" className="select-field" defaultValue="">
          <option value="">Todas</option>
          {ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
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
