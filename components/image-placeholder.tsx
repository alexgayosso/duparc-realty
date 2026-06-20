import { ImageIcon } from "lucide-react";

/**
 * Placeholder visual para fotografía real (versión fondo claro).
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
      className={`relative flex items-center justify-center overflow-hidden bg-stone-200 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(122,31,44,0.06) 0px, rgba(122,31,44,0.06) 2px, transparent 2px, transparent 16px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center text-stone-400">
        <ImageIcon size={26} strokeWidth={1.5} />
        {label && (
          <span className="rounded-full border border-stone-300 bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
