import { ImageIcon } from "lucide-react";

/**
 * Placeholder visual para fotografía real.
 * Úsalo en cualquier lugar donde más adelante vaya una imagen de verdad
 * (Hero, tarjetas de propiedad, tarjetas de zona). La etiqueta deja claro
 * en pantalla qué imagen falta, para que no se confunda con un diseño final.
 *
 * Para sustituir por una imagen real:
 *   <ImagePlaceholder className="..." />
 *   ↓
 *   <Image src="/ruta-real.jpg" alt="..." fill className="object-cover ..." />
 */
export default function ImagePlaceholder({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-slate-800 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(212,175,55,0.10) 0px, rgba(212,175,55,0.10) 2px, transparent 2px, transparent 16px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center text-slate-500">
        <ImageIcon size={26} strokeWidth={1.5} />
        {label && (
          <span className="rounded-full border border-slate-600/60 bg-slate-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
