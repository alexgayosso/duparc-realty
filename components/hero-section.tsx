import ImagePlaceholder from "./image-placeholder";
import SearchBar from "./search-bar";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 pt-28">
      {/* Imagen de fondo a pantalla completa — sustituir por foto real */}
      <ImagePlaceholder
        label="Foto cinematográfica de Ciudad del Carmen — reemplazar"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/40" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 inline-flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-8 bg-gold/60" />
          Ciudad del Carmen · Campeche
          <span className="h-px w-8 bg-gold/60" />
        </span>

        <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.12] text-slate-50 sm:text-5xl lg:text-6xl">
          Exclusividad en cada detalle. Bienes Raíces en Ciudad del Carmen.
        </h1>

        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-300 sm:text-lg">
          Conectando capital inteligente con las propiedades industriales y
          residenciales más exclusivas del sureste mexicano.
        </p>
      </div>

      <div className="relative z-10 px-6 pb-16">
        <SearchBar />
      </div>
    </section>
  );
}
