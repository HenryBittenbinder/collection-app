export type ItemCondition = 'novo' | 'excelente' | 'bom' | 'regular';

export type ItemAvailability = 'exibicao' | 'venda' | 'troca';

export interface Item {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  description: string | null;
  condition: ItemCondition;
  estimated_value: string | null;
  asking_price: string | null;
  availability: ItemAvailability;
  photo: string | null;
  created_at: string;
  updated_at: string;
}
