import { defineField, defineType } from "sanity";

export default defineType({
  name: "primeZone",
  title: "Zona Prime",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre de la zona",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Etiqueta",
      type: "string",
      description: "Ej. Frente al Mar, Vida Residencial Premium.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Numero mas bajo aparece primero (1, 2, 3, 4...).",
      validation: (Rule) => Rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: "Orden manual",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "tag", media: "image" },
  },
});
