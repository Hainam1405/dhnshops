import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "announcementBar", title: "Announcement bar text", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({ name: "heroSubcopy", title: "Hero subcopy", type: "text", rows: 2 }),
    defineField({ name: "emailCaptureCopy", title: "Email capture copy", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
