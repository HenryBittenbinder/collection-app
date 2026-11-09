import { z } from 'zod';

const optionalText = z.string().optional();
const optionalMoney = z
  .string()
  .optional()
  .refine((value) => value === undefined || value.trim() === '' || /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()), {
    message: 'Informe um valor igual ou maior que zero, com até duas casas decimais.',
  })
  .refine((value) => value === undefined || value.trim() === '' || Number(value.replace(',', '.')) >= 0, {
    message: 'O valor não pode ser negativo.',
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
