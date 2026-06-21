import { createClient } from "next-sanity";

/**
 * useCdn: false — deliberado. El CDN de Sanity es más rápido pero puede
 * tardar hasta ~60 segundos en reflejar contenido recién publicado, lo
 * cual es confuso mientras Alex/su hermano están editando activamente
 * en /studio y verificando los cambios al instante. Para un sitio de
 * este tamaño, leer directo de la API (sin CDN) es igual de rápido en
 * la práctica y siempre muestra lo más reciente.
 *
 * El dataset "production" es de lectura pública por defecto en Sanity,
 * así que no necesitamos ningún token secreto para LEER contenido —
 * solo para escribir, y eso ya lo hace el panel /studio con tu propio
 * login de Sanity.
 */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2on6jvd6",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-01-01",
  useCdn: false,
});
