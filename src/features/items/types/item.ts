export type ItemCondition = 'novo' | 'excelente' | 'bom' | 'regular';

export type ItemAvailability = 'exibicao' | 'venda' | 'troca';

export interface ItemOwner {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
}

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
  owner: ItemOwner;
  is_mine: boolean;
  comments_count: number;
  likes_count: number;
  liked_by_me: boolean;
  saved_by_me: boolean;
}
