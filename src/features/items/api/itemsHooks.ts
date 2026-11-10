import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createItem, deleteItem, getItem, getItems, updateItem, type ItemFilters } from './itemsApi';
import type { ItemFormValues } from '@/src/features/items/schemas/itemSchema';

export const itemQueryKeys = {
  all: ['items'] as const,
  list: (filters: ItemFilters) => ['items', 'list', filters] as const,
  detail: (id: number) => ['items', id] as const,
};

export function useItems(filters: ItemFilters = {}, enabled = true) {
  return useQuery({ queryKey: itemQueryKeys.list(filters), queryFn: () => getItems(filters), enabled });
}

export function useItem(id: number) {
  return useQuery({ queryKey: itemQueryKeys.detail(id), queryFn: () => getItem(id), enabled: Number.isFinite(id) });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (values: ItemFormValues) => createItem(values), onSuccess: () => queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }) });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ItemFormValues }) => updateItem(id, values),
    onSuccess: (_item, variables) => Promise.all([
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.detail(variables.id) }),
    ]),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: number) => deleteItem(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }) });
}
