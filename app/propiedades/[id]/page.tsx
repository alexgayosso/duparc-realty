import { notFound } from "next/navigation";
import PropertyGallery from "@/components/property-gallery";
import {
  getAgentInfo,
  getPropertyById,
  getPropertyImages,
  getPropertyLocationLabel,
} from "@/lib/easybroker";

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
    console.error("[PropertyDetail] No se encontro la propiedad:", (error as Error).message);
    notFound();
  }

  const operation = property.operations?.[0];
  const agent = getAgentInfo(property);
  const whatsappDigits = agent.phone?.replace(/\D/g, "");
  const contactEmail = agent.email ?? "info@duparcrealty.com";
  const subject = encodeURIComponent(`Interes en ${property.title} (${property.public_id})`);
  const body = encodeURIComponent(
    `Hola${agent.name ? ` ${agent.name}` : ""}, me interesa esta propiedad:\n\n${property.title}\n${getPropertyLocationLabel(property)}\n\nMi nombre es:\nMi telefono es:\n`
  );

  return (
    <main className="bg-stone-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-4xl">
        <PropertyGallery images={getPropertyImages(property)} alt={property.title} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="font-body text-sm text-stone-500">{getPropertyLocationLabel(property)}</p>
            <h1 className="mt-2 font-display text-3xl text-stone-900 sm:text-4xl">
              {property.title}
            </h1>

            <p className="mt-4 font-body text-2xl font-semibold text-accent-600">
              {operation?.formatted_amount ?? "Disponible bajo consulta"}
              {operation?.type === "rental" ? " / mes" : ""}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone-200 pt-6 font-body text-sm text-stone-600">
              {property.bedrooms ? <span>{property.bedrooms} Habitaciones</span> : null}
              {property.bathrooms ? <span>{property.bathrooms} Banos</span> : null}
              {property.parking_spaces ? <span>{property.parking_spaces} Estacionamientos</span> : null}
              {property.construction_size ? <span>{property.construction_size} m2 construccion</span> : null}
              {property.lot_size ? <span>{property.lot_size} m2 terreno</span> : null}
            </div>

            {property.description && (
              <p className="mt-8 whitespace-pre-line font-body text-base leading-relaxed text-stone-700">
                {property.description}
              </p>
            )}

            {property.features && property.features.length > 0 && (
              <div className="mt-8 border-t border-stone-200 pt-6">
                <h2 className="font-display text-xl text-stone-900">Caracteristicas</h2>
                <ul className="mt-4 grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                  {property.features.map((feature) => (
                    <li key={feature.name} className="font-body text-sm text-stone-600">
                      • {feature.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tarjeta de contacto */}
          <aside className="h-fit rounded-sm border border-stone-200 bg-white p-6">
            <h2 className="font-display text-lg text-stone-900">
              ¿Te interesa esta propiedad?
            </h2>
            {agent.name && (
              <p className="mt-2 font-body text-sm text-stone-500">
                Atendido por {agent.name}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <a
                href={`mailto:${contactEmail}?subject=${subject}&body=${body}`}
                className="inline-flex items-center justify-center rounded-sm bg-accent-600 px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-700"
              >
                Contactar por correo
              </a>

              {whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}?text=${subject}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-sm border border-stone-300 px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:border-accent-600 hover:text-accent-600"
                >
                  WhatsApp
                </a>
              )}

              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center justify-center rounded-sm border border-stone-300 px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:border-accent-600 hover:text-accent-600"
                >
                  Llamar
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
