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
    <section id="zonas-prime" className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Presencia Regional
          </span>
          <h2 className="font-display text-3xl text-slate-50 sm:text-4xl">
            Zonas Prime
          </h2>
          <p className="mt-4 max-w-xl font-body text-sm text-slate-400">
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  {zone.tag}
                </p>
                <h3 className="mt-1 font-display text-lg leading-snug text-slate-50">
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
