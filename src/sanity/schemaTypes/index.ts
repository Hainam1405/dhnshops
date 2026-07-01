import type { SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { collection } from "./collection";
import { review } from "./review";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [product, collection, review, siteSettings];
