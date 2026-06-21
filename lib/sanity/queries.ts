import { sanityClient } from "./client";

export interface PrimeZoneDoc {
  _id: string;
  name: string;
  tag: string;
  order: number;
  imageUrl: string | null;
}

/**
 * Sin caché de Next.js a propósito (ningún `next: { revalidate }`).
 * Este panel se edita activamente desde /studio, así que la prioridad
 * es que el sitio siempre muestre lo más reciente, no ahorrar
 * milisegundos en un sitio de bajo tráfico.
 */

export async function getFeaturedPropertyIds(): Promise<string[]> {
  const query = `*[_type == "homeSettings"][0]{ featuredPropertyIds }`;
  const data = await sanityClient.fetch<{ featuredPropertyIds?: string[] } | null>(
    query
  );
  return data?.featuredPropertyIds?.filter(Boolean) ?? [];
}

export async function getPrimeZones(): Promise<PrimeZoneDoc[]> {
  const query = `*[_type == "primeZone"] | order(order asc) {
    _id,
    name,
    tag,
    order,
    "imageUrl": image.asset->url
  }`;
  return sanityClient.fetch<PrimeZoneDoc[]>(query);
}
