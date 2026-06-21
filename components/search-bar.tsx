import { ChevronDown, MapPin, Search } from "lucide-react";

const OPERATIONS = ["Comprar", "Rentar"];

// Lista EXACTA verificada contra duparcrealty.easybroker.com - no inventada.
const PROPERTY_TYPES = [
  "Bodega comercial",
  "Bodega industrial",
  "Casa",
  "Casa con uso de suelo",
  "Casa en condominio",
  "Departamento",
  "Edificio",
  "Huerta",
  "Local comercial",
  "Local en centro comercial",
  "Nave industrial",
  "Oficina",
  "Otro",
  "Quinta",
  "Rancho",
  "Terreno",
  "Terreno comercial",
  "Terreno industrial",
  "Villa",
];

export default function SearchBar() {
  return (
    <form
      action="/propiedades"
      method="get"
      className="flex w-full flex-col overflow-hidden rounded-sm border border-stone-300 bg-white sm:flex-row"
    >
      <Segment label="Operación" icon="chevron">
        <select name="operacion" className="select-field" defaultValue={OPERATIONS[0]}>
          {OPERATIONS.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </Segment>

      <Segment label="Tipo" border icon="chevron">
        <select name="tipo" className="select-field" defaultValue="">
          <option value="">Tipo de propiedad</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Segment>

      <Segment label="Zona" border icon="pin">
        {/* Texto libre, no un dropdown: location en EasyBroker es una
            cadena de texto plana, no una lista fija de zonas. */}
        <input
          type="text"
          name="zona"
          placeholder="Ej. Ciudad del Carmen"
          className="select-field pr-5"
          style={{ cursor: "text" }}
        />
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
  icon,
}: {
  label: string;
  children: React.ReactNode;
  border?: boolean;
  icon: "chevron" | "pin";
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
        {icon === "chevron" ? (
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-stone-400"
          />
        ) : (
          <MapPin
            size={14}
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-stone-400"
          />
        )}
      </div>
    </label>
  );
}
