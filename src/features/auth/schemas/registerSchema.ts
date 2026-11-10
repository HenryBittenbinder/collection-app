import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  username: z.string().trim().min(1, 'Informe um nome de usuário.').regex(/^\S+$/, 'O nome de usuário não pode conter espaços.'),
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  password_confirmation: z.string().min(1, 'Confirme sua senha.'),
}).refine((values) => values.password === values.password_confirmation, {
  message: 'As senhas não coincidem.',
  path: ['password_confirmation'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
