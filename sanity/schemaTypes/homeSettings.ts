import { defineField, defineType } from "sanity";

export default defineType({
  name: "homeSettings",
  title: "Configuracion del Home",
  type: "document",
  fields: [
    defineField({
      name: "featuredPropertyIds",
      title: "Propiedades Destacadas (IDs de EasyBroker)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Pega aqui el ID de EasyBroker de cada propiedad (ej. EB-B0579). Arrastra para reordenar.",
    }),
  ],
});
