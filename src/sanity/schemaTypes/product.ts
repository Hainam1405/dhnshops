import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", title: "Short description", type: "string" }),
    defineField({ name: "description", type: "text", rows: 5 }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({ name: "compareAtPrice", title: "Compare-at price (USD)", type: "number" }),
    defineField({
      name: "images",
      title: "Gallery images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "colors",
      title: "Colorways",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Name" },
            { name: "hex", type: "string", title: "Hex color", description: "e.g. #0d0f16" },
            {
              name: "images",
              type: "array",
              title: "Images",
              of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
            },
          ],
          preview: { select: { title: "name", subtitle: "hex" } },
        }),
      ],
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "inStock", type: "boolean", title: "In stock", initialValue: true },
          ],
          preview: { select: { title: "label" } },
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "printLocations",
      title: "Print locations",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "badges",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: ["New", "Bestseller", "Limited"] },
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "model3d",
      title: "3D model (.glb, optional)",
      type: "file",
      options: { accept: ".glb,.gltf" },
    }),
    defineField({
      name: "gelatoProductUid",
      title: "Gelato product UID (optional)",
      type: "string",
      description: "Fill this in when you connect Gelato fulfillment.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "shortDescription", media: "images.0" } },
});
