import PropertyCard from "@/components/property-card";
import { getAllProperties } from "@/lib/easybroker";

// Mismas 3 etiquetas que duparcrealty.easybroker.com.
// Nota honesta: "Rentas Temporales" se agrupa con "rental" por ahora --
// no hemos confirmado que EasyBroker distinga un tipo de operacion
// separado para renta vacacional/temporal en los datos que hemos visto.
// Si mas adelante notan que mezcla rentas largas con vacacionales,
// hay que investigar un campo adicional (posiblemente una etiqueta o
// el titulo) para separarlas.
const OPERATION_MAP: Record<string, "sale" | "rental"> = {
  "Propiedades en Venta": "sale",
  "Propiedades en Renta": "rental",
  "Rentas Temporales": "rental",
};

export const metadata = {
  title: "Propiedades | Duparc Realty",
};

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const operacion = typeof params.operacion === "string" ? params.operacion : undefined;
  const tipo = typeof params.tipo === "string" ? params.tipo : undefined;

  const operationType = operacion ? OPERATION_MAP[operacion] : undefined;

  let properties: Awaited<ReturnType<typeof getAllProperties>>["content"] = [];
  let errorMessage: string | null = null;

  try {
    const result = await getAllProperties({
      limit: 24,
      propertyTypes: tipo ? [tipo] : undefined,
      operationTypes: operationType ? [operationType] : undefined,
    });

    properties = operationType
      ? result.content.filter((p) =>
          p.operations.some((op) => op.type === operationType)
        )
      : result.content;
  } catch (error) {
    console.error(
      "[Propiedades] Error consultando EasyBroker:",
      (error as Error).message
    );
    errorMessage =
      "No pudimos cargar el inventario en este momento. Intenta de nuevo en unos minutos.";
  }

  return (
    <main className="bg-stone-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl text-stone-900 sm:text-4xl">
          Propiedades
        </h1>
        <p className="mt-3 font-body text-sm text-stone-500">
          {errorMessage
            ? "-"
            : `${properties.length} resultado${properties.length === 1 ? "" : "s"}`}
        </p>

        {errorMessage && (
          <p className="mt-10 font-body text-stone-500">{errorMessage}</p>
        )}

        {!errorMessage && properties.length === 0 && (
          <p className="mt-10 font-body text-stone-500">
            No encontramos propiedades con esos filtros. Intenta con otra
            combinación de búsqueda.
          </p>
        )}

        <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.public_id} property={property} />
          ))}
        </div>
      </div>
    </main>
  );
}
