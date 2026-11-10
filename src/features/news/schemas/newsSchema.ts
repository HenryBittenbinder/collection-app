import { z } from 'zod';

export const newsSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  body: z.string(),
  publisher: z.string(),
  category: z.string(),
  image: z.string().url(),
  published_at: z.string(),
});

export const newsListSchema = z.array(newsSchema);
