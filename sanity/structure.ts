import type { StructureResolver } from "sanity/structure";

export const singletonStructure: StructureResolver = (S) =>
  S.list()
    .title("Contenido de Duparc Realty")
    .items([
      S.listItem()
        .title("Propiedades Destacadas (Home)")
        .id("homeSettings")
        .child(
          S.document().schemaType("homeSettings").documentId("homeSettings")
        ),
      S.divider(),
      S.documentTypeListItem("primeZone").title("Zonas Prime"),
    ]);
