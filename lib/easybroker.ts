/**
 * Capa de servicio para la API de EasyBroker.
 *
 * IMPORTANTE -- inconsistencia real confirmada entre los 2 endpoints:
 *
 *   GET /properties        (listado)  -> location: STRING plano
 *                                       -> fotos en title_image_full / title_image_thumb
 *                                       -> agent: STRING (solo nombre)
 *
 *   GET /properties/:id    (detalle)  -> location: OBJETO {name, street, lat, lng...}
 *                                       -> fotos en property_images[] (array completo)
 *                                       -> agent: OBJETO {name, email, mobile_phone...}
 *
 * Por eso `location` y `agent` se tipan como union (string | objeto) y
 * SIEMPRE se leen a traves de los helpers de abajo (getPropertyImages,
 * getPropertyLocationLabel, getAgentInfo) -- nunca accedan a esos campos
 * directamente desde un componente, o van a romperse dependiendo de cual
 * endpoint los alimento.
 *
 * `private_description` es informacion INTERNA del agente (notas de
 * comision, contactos internos) -- NUNCA se muestra en el sitio publico.
 * Solo se usa `description`.
 */

const EASYBROKER_API_BASE = "https://api.easybroker.com/v1";
const DEFAULT_REVALIDATE_SECONDS = 3600;

export class EasyBrokerError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EasyBrokerError";
    this.status = status;
  }
}

export interface PropertyOperation {
  type: "sale" | "rental";
  amount: number;
  currency: string;
  formatted_amount?: string;
  unit?: string;
  commission?: { type: string; value?: string };
}

export interface PropertyImageItem {
  title: string | null;
  url: string;
}

export interface PropertyLocationObject {
  name?: string;
  street?: string;
  postal_code?: string | null;
  latitude?: number;
  longitude?: number;
  show_exact_location?: boolean;
}

export interface PropertyAgentObject {
  id?: number;
  name?: string;
  full_name?: string;
  mobile_phone?: string;
  email?: string;
  profile_image_url?: string;
}

export interface PropertyFeature {
  name: string;
  category?: string;
}

export interface Property {
  public_id: string;
  title: string;
  description?: string;
  property_type: string;
  location: string | PropertyLocationObject;
  operations: PropertyOperation[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  half_bathrooms?: number | null;
  parking_spaces?: number | null;
  lot_size?: number | null;
  construction_size?: number | null;
  title_image_full?: string | null;
  title_image_thumb?: string | null;
  property_images?: PropertyImageItem[];
  agent?: string | PropertyAgentObject | null;
  features?: PropertyFeature[];
  public_url?: string;
  show_prices?: boolean;
  share_commission?: boolean;
  updated_at?: string;
}

export interface PropertyListResponse {
  pagination: {
    limit: number;
    page: number;
    total: number;
    next_page: string | null;
  };
  content: Property[];
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  propertyTypes?: string[];
  operationType?: "sale" | "rental";
  statuses?: string[];
  sortBy?: "updated_at-asc" | "updated_at-desc";
  zone?: string;
}

type SearchParamValue = string | number | string[] | undefined;

function buildUrl(path: string, params: Record<string, SearchParamValue>): string {
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
    throw new EasyBrokerError("EASYBROKER_API_KEY no esta configurada en .env.local");
  }

  const response = await fetch(buildUrl(path, params), {
    headers: { "X-Authorization": apiKey, accept: "application/json" },
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new EasyBrokerError(`EasyBroker respondio ${response.status} en ${path}`, response.status);
  }

  return response.json() as Promise<T>;
}

function buildListParams(
  filters: Omit<PropertyFilters, "zone">
): Record<string, SearchParamValue> {
  const params: Record<string, SearchParamValue> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    "search[statuses][]": filters.statuses ?? ["published"],
  };
  if (filters.propertyTypes?.length) {
    params["search[property_types][]"] = filters.propertyTypes;
  }
  // CORRECTO segun doc oficial de EasyBroker: search[operation_type]
  // es SINGULAR y filtra del lado del servidor sobre TODO el inventario
  // (no un array, no operation_types). Antes lo mandabamos mal como
  // array plural, EasyBroker lo ignoraba, y terminabamos filtrando una
  // muestra de 50 localmente -> de ahi los "0 resultados" falsos.
  if (filters.operationType) {
    params["search[operation_type]"] = filters.operationType;
  }
  if (filters.sortBy) {
    params["search[sort_by]"] = filters.sortBy;
  }
  return params;
}

function matchesZone(property: Property, zone?: string): boolean {
  if (!zone) return true;
  return getPropertyLocationLabel(property).toLowerCase().includes(zone.toLowerCase());
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams({ limit, sortBy: "updated_at-desc" })
  );
  return data.content;
}

export async function getAllProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
  // Todo el filtrado (operacion + tipo) lo hace EasyBroker del lado del
  // servidor, sobre las 2,132 propiedades. Por eso la paginacion (total,
  // page) que regresa es EXACTA y replica el comportamiento de su buscador.
  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams(filters)
  );

  // El filtro de zona si se hace localmente porque la API no lo expone
  // como filtro de servidor en este plan. Solo aplica si se pidio.
  if (filters.zone) {
    return {
      ...data,
      content: data.content.filter((p) => matchesZone(p, filters.zone)),
    };
  }

  return data;
}

export async function getPropertyById(id: string): Promise<Property> {
  return easyBrokerFetch<Property>(`/properties/${id}`, {});
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  const results = await Promise.allSettled(ids.map((id) => getPropertyById(id)));
  return results
    .filter((result): result is PromiseFulfilledResult<Property> => {
      if (result.status === "rejected") {
        console.error("[easybroker] getPropertiesByIds - ID invalido u omitido:", (result.reason as Error)?.message);
      }
      return result.status === "fulfilled";
    })
    .map((result) => result.value);
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
  if (property.bathrooms) parts.push(`${property.bathrooms} Banos`);
  if (property.construction_size) parts.push(`${property.construction_size} m2`);
  return parts.join(" - ");
}

/** Siempre usar esta funcion -- nunca leer property.location directo. */
export function getPropertyLocationLabel(property: Property): string {
  if (typeof property.location === "string") return property.location;
  return property.location?.name ?? "";
}

/** Todas las fotos disponibles, sin importar de cual endpoint vinieron. */
export function getPropertyImages(property: Property): string[] {
  const fromDetail = property.property_images?.map((img) => img.url) ?? [];
  if (fromDetail.length > 0) return fromDetail;
  if (property.title_image_full) return [property.title_image_full];
  return [];
}

/** Una sola foto -- para tarjetas (Destacadas, resultados de busqueda). */
export function getPropertyImage(property: Property): string | null {
  return getPropertyImages(property)[0] ?? null;
}

/** Siempre usar esta funcion -- nunca leer property.agent directo. */
export function getAgentInfo(property: Property): {
  name: string | null;
  email: string | null;
  phone: string | null;
} {
  if (!property.agent) return { name: null, email: null, phone: null };
  if (typeof property.agent === "string") {
    return { name: property.agent, email: null, phone: null };
  }
  return {
    name: property.agent.full_name ?? property.agent.name ?? null,
    email: property.agent.email ?? null,
    phone: property.agent.mobile_phone ?? null,
  };
}

export const SAMPLE_PROPERTIES: Property[] = [
  {
    public_id: "SAMPLE-1",
    title: "Residencia frente al mar - Carretera Costera",
    property_type: "Casa",
    location: "Carretera Costera, Carmen, Campeche",
    bedrooms: 4,
    bathrooms: 5,
    construction_size: 480,
    operations: [],
  },
  {
    public_id: "SAMPLE-2",
    title: "Nave industrial - Zona Industrial",
    property_type: "Nave industrial",
    location: "Zona Industrial, Carmen, Campeche",
    construction_size: 2200,
    operations: [],
  },
  {
    public_id: "SAMPLE-3",
    title: "Penthouse - Isla del Carmen",
    property_type: "Departamento",
    location: "Isla del Carmen, Carmen, Campeche",
    bedrooms: 3,
    bathrooms: 3,
    construction_size: 210,
    operations: [],
  },
];
