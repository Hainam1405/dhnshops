"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "aether",
  title: "AETHER Studio",
  basePath: "/studio",
  // Falls back to a placeholder so importing this module never throws when the
  // project isn't configured yet; the /studio route guards actual mounting.
  projectId: projectId || "placeholder",
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
