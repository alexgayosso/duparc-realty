import Link from "next/link";
import PropertyImage from "./property-image";
import { getFeaturedPropertyIds } from "@/lib/sanity/queries";
import {
  getFeaturedProperties,
  getPropertiesByIds,
  getPropertyImage,
  getPropertyLocationLabel,
  getPropertyPrice,
  getPropertySpecs,
  SAMPLE_PROPERTIES,
  type Property,
} from "@/lib/easybroker";

export default async function FeaturedProperties() {
  let properties: Property[];
  let isLive = true;

  try {
    const curatedIds = await getFeaturedPropertyIds();

    properties =
      curatedIds.length > 0
        ? await getPropertiesByIds(curatedIds)
        : await getFeaturedProperties(6);
  } catch (error) {
    console.error(
      "[FeaturedProperties] EasyBroker/Sanity no disponible, usando datos de muestra:",
      (error as Error).message
    );
    properties = SAMPLE_PROPERTIES;
    isLive = false;
  }

  const hasResults = properties.length > 0;

  return (
    <section className="bg-stone-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">
            Portafolio Exclusivo
          </span>
          <h2 className="font-display text-3xl text-stone-900 sm:text-4xl">
            Propiedades Destacadas
          </h2>
        </div>

        {!hasResults && isLive && (
          <p className="text-center font-body text-stone-500">
            Estamos actualizando nuestro portafolio. Vuelve pronto.
          </p>
        )}

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.public_id}
              href={isLive ? `/propiedades/${property.public_id}` : "#"}
              className="group block"
            >
              <PropertyImage
                src={getPropertyImage(property)}
                alt={property.title}
                className="aspect-[4/5] w-full rounded-sm"
              />
              <div className="mt-6 space-y-2">
                <h3 className="font-display text-lg leading-snug text-stone-900">
                  {property.title}
                </h3>
                <p className="font-body text-sm text-stone-500">
                  {getPropertySpecs(property) ||
                    getPropertyLocationLabel(property)}
                </p>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-accent-600">
                  {getPropertyPrice(property)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}