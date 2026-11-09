import { z } from 'zod';

const optionalText = z.string().optional();
const optionalMoney = z
  .string()
  .optional()
  .refine((value) => value === undefined || value === '' || /^\d+(?:\.\d{2})?$/.test(value), {
    message: 'O valor deve ser maior ou igual a zero, com no máximo duas casas decimais.',
  });

export const itemSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do item.'),
  category: z.string().trim().min(1, 'Informe a categoria.'),
  brand: optionalText,
  description: optionalText,
  condition: z.enum(['novo', 'excelente', 'bom', 'regular'], {
    message: 'Selecione uma condição válida.',
  }),
  estimated_value: optionalMoney,
  asking_price: optionalMoney,
  availability: z.enum(['exibicao', 'venda', 'troca'], {
    message: 'Selecione uma disponibilidade válida.',
  }),
  photo: z
    .object({
      uri: z.string().min(1, 'Selecione uma imagem válida.'),
      fileName: z.string().optional(),
      mimeType: z.string().optional(),
    })
    .optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
