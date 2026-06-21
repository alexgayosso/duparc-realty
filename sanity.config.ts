import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { singletonStructure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Duparc Realty - Panel de Contenido",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2on6jvd6",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool({ structure: singletonStructure })],
  schema: {
    types: schemaTypes,
  },
});
