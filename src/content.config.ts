import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photoSchema = z.object({
  src: z.string(),
  alt: z.string(),
  orientation: z.enum(['landscape', 'portrait']),
  credit: z.string(),
  creditUrl: z.string().url(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    photos: z.array(photoSchema).min(1),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
