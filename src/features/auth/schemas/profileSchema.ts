import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  username: z.string().trim().min(1, 'Informe um nome de usuário.').regex(/^\S+$/, 'O nome de usuário não pode conter espaços.'),
  bio: z.string().max(160, 'A descrição pode ter no máximo 160 caracteres.'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
