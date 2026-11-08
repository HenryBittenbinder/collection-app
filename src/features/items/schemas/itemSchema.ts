import { z } from 'zod';

export const itemSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  categoria: z.string().min(2, 'A categoria deve ser preenchida.'),
  marca: z.string().min(2, 'A marca deve ser preenchida.'),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  estadoConservacao: z.string().min(2, 'O estado de conservação deve ser informado.'),
  valorEstimado: z.coerce.number().min(0, 'O valor não pode ser negativo.'),
  precoDesejado: z.coerce.number().min(0, 'O preço não pode ser negativo.'),
  disponibilidade: z.enum(['exibicao', 'venda', 'troca'], {
    message: 'Selecione uma disponibilidade válida.',
  }),
  fotoUrl: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
