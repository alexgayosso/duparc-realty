import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property-card";
import { getAllProperties } from "@/lib/easybroker";

const OPERATION_MAP: Record<string, "sale" | "rental"> = {
  "Propiedades en Venta": "sale",
  "Propiedades en Renta": "rental",
  "Rentas Temporales": "rental",
};

const PER_PAGE = 24;

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
  const pageParam = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const operationType = operacion ? OPERATION_MAP[operacion] : undefined;

  let properties: Awaited<ReturnType<typeof getAllProperties>>["content"] = [];
  let totalPages = 1;
  let total = 0;
  let errorMessage: string | null = null;

  try {
    // EasyBroker hace TODO el filtrado del lado del servidor (operacion +
    // tipo) sobre las 2,132 propiedades, igual que su propio buscador.
    const result = await getAllProperties({
      page,
      limit: PER_PAGE,
      propertyTypes: tipo ? [tipo] : undefined,
      operationType,
    });

    properties = result.content;
    total = result.pagination.total;
    totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  } catch (error) {
    console.error("[Propiedades] Error consultando EasyBroker:", (error as Error).message);
    errorMessage =
      "No pudimos cargar el inventario en este momento. Intenta de nuevo en unos minutos.";
  }

  const buildPageUrl = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (operacion) sp.set("operacion", operacion);
    if (tipo) sp.set("tipo", tipo);
    sp.set("page", String(targetPage));
    return `/propiedades?${sp.toString()}`;
  };

  return (
    <main className="bg-stone-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-accent-600 hover:text-accent-700"
        >
          <ArrowLeft size={14} />
          Nueva búsqueda
        </Link>

        <h1 className="mt-6 font-display text-3xl text-stone-900 sm:text-4xl">
          Propiedades
        </h1>
        <p className="mt-3 font-body text-sm text-stone-500">
          {errorMessage
            ? "-"
            : `${total} propiedades${tipo ? ` · ${tipo}` : ""}${
                operacion ? ` · ${operacion}` : ""
              }`}
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

        {!errorMessage && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="inline-flex items-center gap-1 rounded-sm border border-stone-300 px-4 py-2 font-body text-sm text-stone-700 transition-colors hover:border-accent-600 hover:text-accent-600"
              >
                <ChevronLeft size={16} />
                Anterior
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-sm border border-stone-200 px-4 py-2 font-body text-sm text-stone-300">
                <ChevronLeft size={16} />
                Anterior
              </span>
            )}

            <span className="font-body text-sm text-stone-500">
              Página {page} de {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="inline-flex items-center gap-1 rounded-sm border border-stone-300 px-4 py-2 font-body text-sm text-stone-700 transition-colors hover:border-accent-600 hover:text-accent-600"
              >
                Siguiente
                <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-sm border border-stone-200 px-4 py-2 font-body text-sm text-stone-300">
                Siguiente
                <ChevronRight size={16} />
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
