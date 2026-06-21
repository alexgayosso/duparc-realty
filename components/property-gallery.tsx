"use client";

import { useState } from "react";
import ImagePlaceholder from "./image-placeholder";

export default function PropertyGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <ImagePlaceholder label="Foto de propiedad" className="aspect-[16/10] w-full rounded-sm" />
    );
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[active]}
        alt={alt}
        className="aspect-[16/10] w-full rounded-sm object-cover"
      />

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                index === active ? "border-accent-600" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-16 w-24 object-cover sm:h-20 sm:w-28"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
