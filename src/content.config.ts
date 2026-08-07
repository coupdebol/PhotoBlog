import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    // The photo shown on the home grid tile. Photos that appear in the
    // body itself are placed inline with a <Photo /> component, so this
    // is just a pointer to whichever one should represent the entry —
    // normally the first/best photo in the body.
    cover: z.object({
      src: z.string(),
      alt: z.string(),
      orientation: z.enum(['landscape', 'portrait']),
    }),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
