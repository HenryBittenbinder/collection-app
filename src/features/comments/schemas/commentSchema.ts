import { z } from 'zod';

export const commentSchema = z.object({
  body: z.string().trim().min(1, 'Escreva um comentário.').max(500, 'O comentário deve ter no máximo 500 caracteres.'),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
