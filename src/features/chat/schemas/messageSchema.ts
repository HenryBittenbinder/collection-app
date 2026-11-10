import { z } from 'zod';

export const messageSchema = z.object({
  body: z.string().trim().min(1, 'Digite uma mensagem.').max(1000, 'A mensagem deve ter no máximo 1000 caracteres.'),
});

export type MessageFormValues = z.infer<typeof messageSchema>;
