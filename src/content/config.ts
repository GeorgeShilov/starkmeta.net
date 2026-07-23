import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("starkmeta.net"),
    category: z.string().default("General"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    inlineImages: z.array(z.string()).default([]),
    referenceUrl: z.union([z.string().url(), z.literal("")]).optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { blog };
