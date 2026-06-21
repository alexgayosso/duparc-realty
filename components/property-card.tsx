import Link from "next/link";
import PropertyImage from "./property-image";
import {
  getPropertyImage,
  getPropertyLocationLabel,
  getPropertyPrice,
  getPropertySpecs,
  type Property,
} from "@/lib/easybroker";

export default function PropertyCard({ property }: { property: Property }) {
  // Hasta que tengamos página propia de detalle (/propiedades/[id]),
  // cada tarjeta enlaza directo al anuncio real en EasyBroker — así
  // nunca lleva a un enlace roto mientras construimos esa página.
  const href = property.url ?? "#";

  return (
    <Link href={href} className="group block">
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
          {getPropertySpecs(property) || getPropertyLocationLabel(property)}
        </p>
        <p className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-accent-600">
          {getPropertyPrice(property)}
        </p>
      </div>
    </Link>
  );
}
