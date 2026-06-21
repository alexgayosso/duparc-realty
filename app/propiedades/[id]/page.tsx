import { notFound } from "next/navigation";
import PropertyImage from "@/components/property-image";
import { getPropertyById } from "@/lib/easybroker";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let property;
  try {
    property = await getPropertyById(id);
  } catch (error) {
    console.error(
      "[PropertyDetail] No se encontró la propiedad:",
      (error as Error).message
    );
    notFound();
  }

  const operation = property.operations?.[0];

  return (
    <main className="bg-stone-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-4xl">
        <PropertyImage
          src={property.title_image_full ?? null}
          alt={property.title}
          className="aspect-[16/10] w-full rounded-sm"
        />

        <div className="mt-8">
          <p className="font-body text-sm text-stone-500">{property.location}</p>
          <h1 className="mt-2 font-display text-3xl text-stone-900 sm:text-4xl">
            {property.title}
          </h1>

          <p className="mt-4 font-body text-2xl font-semibold text-accent-600">
            {operation?.formatted_amount ?? "Disponible bajo consulta"}
            {operation?.type === "rental" ? " / mes" : ""}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone-200 pt-6 font-body text-sm text-stone-600">
            {property.bedrooms ? <span>{property.bedrooms} Habitaciones</span> : null}
            {property.bathrooms ? <span>{property.bathrooms} Baños</span> : null}
            {property.parking_spaces ? (
              <span>{property.parking_spaces} Estacionamientos</span>
            ) : null}
            {property.construction_size ? (
              <span>{property.construction_size} m² construcción</span>
            ) : null}
            {property.lot_size ? <span>{property.lot_size} m² terreno</span> : null}
          </div>

          {property.description && (
            <p className="mt-8 whitespace-pre-line font-body text-base leading-relaxed text-stone-700">
              {property.description}
            </p>
          )}

          {property.agent && (
            <p className="mt-8 font-body text-sm text-stone-500">
              Atendido por {property.agent}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
