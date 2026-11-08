export type ItemAvailability = 'exibicao' | 'venda' | 'troca';

export interface Item {
  id: string;
  nome: string;
  categoria: string;
  marca: string;
  descricao: string;
  estadoConservacao: string;
  valorEstimado: number;
  precoDesejado: number;
  disponibilidade: ItemAvailability;
  fotoUrl: string;
}
