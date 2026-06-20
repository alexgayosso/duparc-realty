/**
 * Capa de servicio para la API de EasyBroker.
 *
 * Documentación verificada: https://dev.easybroker.com/reference
 * - Base URL:   https://api.easybroker.com/v1
 * - Auth:       header `X-Authorization: <API_KEY>` (NO es Bearer token)
 * - Límite:     20 requests/segundo, máx. 50 resultados por página
 * - IMPORTANTE: EasyBroker exige que su API solo se consuma desde backend
 *   (no desde el navegador). Por eso este archivo solo debe importarse
 *   desde Server Components o Route Handlers — nunca desde un componente
 *   con "use client". La env var EASYBROKER_API_KEY (sin prefijo
 *   NEXT_PUBLIC_) ya respeta esa regla por diseño.
 *
 * Nota sobre campos no confirmados: `operations` y `property_images` son
 * la forma estándar documentada por EasyBroker para precio y fotos, pero
 * no pude verificarlos con una respuesta real (la cuenta de Duparc aún no
 * existe). En cuanto tengan API Key, revisen un GET /properties real y
 * ajustamos los nombres de campo si difieren.
 */

const EASYBROKER_API_BASE = "https://api.easybroker.com/v1";
const DEFAULT_REVALIDATE_SECONDS = 3600; // 1 hora — balance entre velocidad y frescura del inventario

export class EasyBrokerError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EasyBrokerError";
    this.status = status;
  }
}

/* ----------------------------- Tipos ----------------------------- */

export interface PropertyLocation {
  name?: string;
  street?: string | null;
  city_area?: string | null;
  city?: string | null;
  region: string;
  postal_code?: string | null;
  show_exact_location?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface PropertyOperation {
  type: "sale" | "rental";
  amount: number;
  currency: string;
  formatted_amount?: string;
}

export interface PropertyImage {
  url: string;
  title?: string | null;
}

export interface Property {
  public_id: string;
  title: string;
  description?: string;
  property_type: string;
  status?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  half_bathrooms?: number | null;
  parking_spaces?: number | null;
  lot_size?: number | null;
  construction_size?: number | null;
  location: PropertyLocation;
  operations: PropertyOperation[];
  property_images?: PropertyImage[];
  title_image_full?: string | null;
  agency_id?: string;
  agent_id?: string | null;
  created_at?: string;
  updated_at?: string;
  url?: string;
}

export interface PropertyListResponse {
  pagination: {
    limit: number;
    page: number;
    total: number;
    next_page: number | null;
  };
  content: Property[];
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  propertyTypes?: string[];
  /** Verificar en su plan si `search[operation_types][]` está soportado;
   *  si no, filtrar `operations[].type` del lado del cliente tras el fetch. */
  operationTypes?: Array<"sale" | "rental">;
  statuses?: string[];
  sortBy?: "updated_at-asc" | "updated_at-desc";
  /** EasyBroker no documenta un filtro de zona en /properties; aplicamos
   *  este filtro nosotros mismos sobre location.city / city_area. */
  zone?: string;
}

/* --------------------------- Fetch base --------------------------- */

type SearchParamValue = string | number | string[] | undefined;

function buildUrl(
  path: string,
  params: Record<string, SearchParamValue>
): string {
  const url = new URL(`${EASYBROKER_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function easyBrokerFetch<T>(
  path: string,
  params: Record<string, SearchParamValue> = {},
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<T> {
  const apiKey = process.env.EASYBROKER_API_KEY;

  if (!apiKey) {
    throw new EasyBrokerError(
      "EASYBROKER_API_KEY no está configurada en .env.local"
    );
  }

  const response = await fetch(buildUrl(path, params), {
    headers: {
      "X-Authorization": apiKey,
      accept: "application/json",
    },
    // Cache de datos de Next.js (equivalente a ISR para fetch nativo):
    // el inventario se revalida cada `revalidateSeconds`, no en cada visita.
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new EasyBrokerError(
      `EasyBroker respondió ${response.status} en ${path}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

function buildListParams(
  filters: PropertyFilters
): Record<string, SearchParamValue> {
  const params: Record<string, SearchParamValue> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    "search[statuses][]": filters.statuses ?? ["published"],
  };

  if (filters.propertyTypes?.length) {
    params["search[property_types][]"] = filters.propertyTypes;
  }
  if (filters.operationTypes?.length) {
    params["search[operation_types][]"] = filters.operationTypes;
  }
  if (filters.sortBy) {
    params["search[sort_by]"] = filters.sortBy;
  }

  return params;
}

function matchesZone(property: Property, zone?: string): boolean {
  if (!zone) return true;
  const haystack = [property.location?.city_area, property.location?.city]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(zone.toLowerCase());
}

/* ------------------------- Funciones públicas ------------------------- */

/** Propiedades destacadas para el Home: las más recientes publicadas. */
export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams({ limit, sortBy: "updated_at-desc" })
  );
  return data.content;
}

/** Listado completo con filtros, para la página de búsqueda. */
export async function getAllProperties(
  filters: PropertyFilters = {}
): Promise<PropertyListResponse> {
  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams(filters)
  );

  if (filters.zone) {
    return {
      ...data,
      content: data.content.filter((p) => matchesZone(p, filters.zone)),
    };
  }

  return data;
}

/** Detalle de una propiedad para su página individual. */
export async function getPropertyById(id: string): Promise<Property> {
  return easyBrokerFetch<Property>(`/properties/${id}`, {});
}

/* --------------------------- Helpers de UI --------------------------- */

export function getPropertyPrice(property: Property): string {
  const operation = property.operations?.[0];
  if (!operation) return "Disponible bajo consulta";

  const formatted =
    operation.formatted_amount ??
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: operation.currency || "MXN",
      maximumFractionDigits: 0,
    }).format(operation.amount);

  return operation.type === "rental" ? `${formatted} / mes` : formatted;
}

export function getPropertySpecs(property: Property): string {
  const parts: string[] = [];
  if (property.bedrooms) parts.push(`${property.bedrooms} Hab`);
  if (property.bathrooms) parts.push(`${property.bathrooms} Baños`);
  if (property.construction_size) parts.push(`${property.construction_size} m²`);
  return parts.join(" · ");
}

export function getPropertyLocationLabel(property: Property): string {
  return (
    [property.location?.city_area, property.location?.city]
      .filter(Boolean)
      .join(", ") || property.location?.region || ""
  );
}

export function getPropertyImage(property: Property): string | null {
  return (
    property.title_image_full ?? property.property_images?.[0]?.url ?? null
  );
}

/**
 * Datos de muestra: se usan SOLO si la llamada a EasyBroker falla
 * (típicamente porque EASYBROKER_API_KEY no está configurada todavía).
 * Conservan la misma forma que `Property` para que el componente que
 * los consume no necesite ninguna lógica distinta entre datos reales
 * y datos de muestra.
 */
export const SAMPLE_PROPERTIES: Property[] = [
  {
    public_id: "SAMPLE-1",
    title: "Residencia frente al mar — Carretera Costera",
    property_type: "Casa",
    status: "published",
    bedrooms: 4,
    bathrooms: 5,
    construction_size: 480,
    location: {
      region: "Campeche",
      city: "Ciudad del Carmen",
      city_area: "Carretera Costera",
    },
    operations: [],
  },
  {
    public_id: "SAMPLE-2",
    title: "Nave industrial — Zona Industrial",
    property_type: "Bodega comercial",
    status: "published",
    construction_size: 2200,
    location: {
      region: "Campeche",
      city: "Ciudad del Carmen",
      city_area: "Zona Industrial",
    },
    operations: [],
  },
  {
    public_id: "SAMPLE-3",
    title: "Penthouse — Isla del Carmen",
    property_type: "Departamento",
    status: "published",
    bedrooms: 3,
    bathrooms: 3,
    construction_size: 210,
    location: {
      region: "Campeche",
      city: "Ciudad del Carmen",
      city_area: "Isla del Carmen",
    },
    operations: [],
  },
];
