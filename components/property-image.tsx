import ImagePlaceholder from "./image-placeholder";

/**
 * Usa <img> nativo (no next/image) deliberadamente: aún no confirmamos
 * el dominio del CDN de imágenes de EasyBroker para darlo de alta en
 * next.config.js (images.remotePatterns). En cuanto tengan su cuenta y
 * vean una respuesta real de la API con property_images, me pasan el
 * dominio y lo cambiamos a next/image para mejor performance.
 */
export default function PropertyImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <ImagePlaceholder
        label="Foto de propiedad — EasyBroker"
        className={className}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
