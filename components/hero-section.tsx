import SearchBar from "./search-bar";
import { getAvailablePropertyTypes } from "@/lib/easybroker";

export default async function HeroSection() {
  // Tipos reales del inventario (cacheado 24h dentro de la funcion).
  // Si falla, SearchBar usa su lista de respaldo.
  let propertyTypes: string[] = [];
  try {
    propertyTypes = await getAvailablePropertyTypes();
  } catch (error) {
    console.error("[HeroSection] No se pudieron cargar los tipos:", (error as Error).message);
  }

  return (
    <section className="relative overflow-hidden bg-stone-50 pt-24 lg:pt-0">
      <div className="mx-auto grid max-w-[1700px] lg:grid-cols-[1fr_1.15fr]">
        {/* Panel de texto */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          <span className="mb-5 inline-flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-accent-600">
            <span className="h-px w-7 bg-accent-300" />
            Sureste de México
          </span>

          <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.15] text-stone-900 sm:text-5xl">
            Exclusividad en cada detalle. Bienes Raíces en el sureste de México.
          </h1>

          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-stone-600">
            Conectando capital inteligente con las propiedades industriales y
            residenciales premium del sureste mexicano.
          </p>
        </div>

        {/* Panel fotográfico */}
        <div className="relative min-h-[320px] lg:min-h-[620px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/oficinas-duparc.jpg"
            alt="Oficinas Duparc Realty"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Buscador: ancho completo, con separación clara del placeholder de arriba */}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-14 lg:px-16">
        <SearchBar propertyTypes={propertyTypes} />
      </div>
    </section>
  );
}
