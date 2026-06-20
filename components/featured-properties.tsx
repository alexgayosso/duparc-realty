import ImagePlaceholder from "./image-placeholder";

/**
 * Datos de muestra únicamente. En la Fase 2 (integración EasyBroker)
 * este arreglo se sustituye por un fetch real a la API y este componente
 * pasa a ser async para consumir ese servicio.
 */
const PLACEHOLDER_PROPERTIES = [
  {
    title: "Residencia frente al mar — Carretera Costera",
    specs: "4 Hab · 5 Baños · 480 m²",
    price: "Disponible bajo consulta",
  },
  {
    title: "Nave industrial — Zona Industrial",
    specs: "2,200 m² de nave · Patio de maniobras",
    price: "Disponible bajo consulta",
  },
  {
    title: "Penthouse — Isla del Carmen",
    specs: "3 Hab · 3 Baños · 210 m²",
    price: "Disponible bajo consulta",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Portafolio Exclusivo
          </span>
          <h2 className="font-display text-3xl text-slate-50 sm:text-4xl">
            Propiedades Destacadas
          </h2>
        </div>

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_PROPERTIES.map((property) => (
            <article key={property.title} className="group">
              <ImagePlaceholder
                label="Foto de propiedad — EasyBroker / reemplazar"
                className="aspect-[4/5] w-full rounded-sm"
              />
              <div className="mt-6 space-y-2">
                <h3 className="font-display text-lg leading-snug text-slate-50">
                  {property.title}
                </h3>
                <p className="font-body text-sm text-slate-400">
                  {property.specs}
                </p>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-gold">
                  {property.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
