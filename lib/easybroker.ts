/**
 * Capa de servicio para la API de EasyBroker.
 *
 * Forma de los datos VERIFICADA contra la API real (no documentacion,
 * no suposiciones) el 21/06/2026 con la cuenta de Duparc Realty:
 *
 * - `location` es una cadena de texto plana (ej. "Bivalbo, Carmen,
 *   Campeche"), NO un objeto con city/city_area/region.
 * - `search[operation_types][]` NO filtra nada del lado de EasyBroker
 *   (confirmado: pedir solo "sale" regreso una renta de todos modos).
 *   El filtro de compra/renta se aplica aqui mismo, despues de recibir
 *   la respuesta, nunca confiando en ese parametro.
 * - `search[property_types][]` SI funciona correctamente (confirmado).
 * - No existe ningun campo de URL publica en la respuesta -- por eso
 *   cada propiedad usa su propia pagina interna /propiedades/[id] en
 *   vez de enlazar a EasyBroker directamente.
 * - El listado no incluye `description`; eso solo aparece en el detalle
 *   individual (GET /properties/:id).
 *
 * Base URL:   https://api.easybroker.com/v1
 * Auth:       header X-Authorization: <API_KEY> (no es Bearer token)
 * Limite:     20 requests/segundo, max. 50 resultados por pagina
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
  commission?: {
    type: string;
    value?: string;
  };
}

export interface Property {
  public_id: string;
  title: string;
  description?: string;
  property_type: string;
  location: string;
  operations: PropertyOperation[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  half_bathrooms?: number | null;
  parking_spaces?: number | null;
  lot_size?: number | null;
  construction_size?: number | null;
  title_image_full?: string | null;
  title_image_thumb?: string | null;
  agent?: string | null;
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
  operationTypes?: Array<"sale" | "rental">;
  statuses?: string[];
  sortBy?: "updated_at-asc" | "updated_at-desc";
  zone?: string;
}

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
      "EASYBROKER_API_KEY no esta configurada en .env.local"
    );
  }

  const response = await fetch(buildUrl(path, params), {
    headers: {
      "X-Authorization": apiKey,
      accept: "application/json",
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new EasyBrokerError(
      `EasyBroker respondio ${response.status} en ${path}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

function buildListParams(
  filters: Omit<PropertyFilters, "operationTypes" | "zone">
): Record<string, SearchParamValue> {
  const params: Record<string, SearchParamValue> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    "search[statuses][]": filters.statuses ?? ["published"],
  };

  if (filters.propertyTypes?.length) {
    params["search[property_types][]"] = filters.propertyTypes;
  }
  if (filters.sortBy) {
    params["search[sort_by]"] = filters.sortBy;
  }

  return params;
}

function matchesZone(property: Property, zone?: string): boolean {
  if (!zone) return true;
  return property.location?.toLowerCase().includes(zone.toLowerCase()) ?? false;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams({ limit, sortBy: "updated_at-desc" })
  );
  return data.content;
}

export async function getAllProperties(
  filters: PropertyFilters = {}
): Promise<PropertyListResponse> {
  const wantsOperationFilter = Boolean(filters.operationTypes?.length);
  const targetLimit = filters.limit ?? 24;

  const fetchLimit = wantsOperationFilter
    ? Math.min(Math.max(targetLimit * 3, 50), 50)
    : targetLimit;

  const data = await easyBrokerFetch<PropertyListResponse>(
    "/properties",
    buildListParams({ ...filters, limit: fetchLimit })
  );

  let content = data.content;

  if (wantsOperationFilter) {
    content = content.filter((p) =>
      p.operations.some((op) => filters.operationTypes!.includes(op.type))
    );
    content = content.slice(0, targetLimit);
  }

  if (filters.zone) {
    content = content.filter((p) => matchesZone(p, filters.zone));
  }

  return { ...data, content };
}

export async function getPropertyById(id: string): Promise<Property> {
  return easyBrokerFetch<Property>(`/properties/${id}`, {});
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  const results = await Promise.allSettled(ids.map((id) => getPropertyById(id)));

  return results
    .filter((result): result is PromiseFulfilledResult<Property> => {
      if (result.status === "rejected") {
        console.error(
          "[easybroker] getPropertiesByIds - ID invalido u omitido:",
          (result.reason as Error)?.message
        );
      }
      return result.status === "fulfilled";
    })
    .map((result) => result.value);
}

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

export function getPropertyLocationLabel(property: Property): string {
  return property.location ?? "";
}

export function getPropertyImage(property: Property): string | null {
  return property.title_image_full ?? null;
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
