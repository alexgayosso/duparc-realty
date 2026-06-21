import { ChevronDown, Search } from "lucide-react";

// Mismas 3 opciones, mismo texto que duparcrealty.easybroker.com
const OPERATIONS = [
  "Propiedades en Venta",
  "Propiedades en Renta",
  "Rentas Temporales",
];

/**
 * Los tipos de propiedad llegan como prop desde el servidor
 * (getAvailablePropertyTypes), generados a partir del inventario REAL.
 * Si no se pasan (o fallo la carga), se usa una lista minima de respaldo
 * para que el buscador nunca quede sin opciones.
 */
const FALLBACK_TYPES = ["Casa", "Departamento", "Terreno", "Local comercial"];

export default function SearchBar({
  propertyTypes,
}: {
  propertyTypes?: string[];
}) {
  const types = propertyTypes && propertyTypes.length > 0 ? propertyTypes : FALLBACK_TYPES;

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
          <option value="">Tipo de propiedad</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
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
