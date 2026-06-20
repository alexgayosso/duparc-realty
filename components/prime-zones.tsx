import ImagePlaceholder from "./image-placeholder";

const ZONES = [
  {
    name: "Ciudad del Carmen",
    tag: "Corazón Industrial y Corporativo",
  },
  {
    name: "Isla del Carmen · Zona Centro",
    tag: "Vida Residencial Premium",
  },
  {
    name: "Carretera Costera · Playa Norte",
    tag: "Frente al Mar",
  },
  {
    name: "Riviera Maya, Quintana Roo",
    tag: "Inversión y Destino Turístico",
  },
];

export default function PrimeZones() {
  return (
    <section id="zonas-prime" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">
            Presencia Regional
          </span>
          <h2 className="font-display text-3xl text-stone-900 sm:text-4xl">
            Zonas Prime
          </h2>
          <p className="mt-4 max-w-xl font-body text-sm text-stone-500">
            De Ciudad del Carmen a la Riviera Maya: cobertura en los mercados
            del sur-sureste mexicano donde el patrimonio industrial y
            residencial se encuentran.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ZONES.map((zone) => (
            <div
              key={zone.name}
              className="relative overflow-hidden rounded-sm"
            >
              <ImagePlaceholder
                label="Foto de zona — reemplazar"
                className="aspect-[3/4] w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-200">
                  {zone.tag}
                </p>
                <h3 className="mt-1 font-display text-lg leading-snug text-white">
                  {zone.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
