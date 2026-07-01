import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "authorName", title: "Author", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "rating",
      type: "number",
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "verified", type: "boolean", initialValue: true }),
    defineField({ name: "date", type: "date", initialValue: () => new Date().toISOString().slice(0, 10) }),
  ],
  preview: { select: { title: "authorName", subtitle: "rating" } },
});
