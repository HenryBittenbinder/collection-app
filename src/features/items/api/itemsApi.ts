import type { ItemFormValues } from '@/src/features/items/schemas/itemSchema';
import type { Item } from '@/src/features/items/types/item';
import api from '@/src/shared/lib/api';

type ItemResponse = { data: Item };
type ItemsResponse = { data: Item[] };

export function buildItemFormData(values: ItemFormValues, includeEmptyOptionals = false) {
  const formData = new FormData();
  const fields: Array<[string, string | undefined]> = [
    ['name', values.name],
    ['category', values.category],
    ['condition', values.condition],
    ['availability', values.availability],
    ['brand', values.brand],
    ['description', values.description],
    ['estimated_value', values.estimated_value?.replace(',', '.')],
    ['asking_price', values.asking_price?.replace(',', '.')],
  ];

  for (const [key, value] of fields) {
    if (value !== undefined && (includeEmptyOptionals || value.trim() !== '')) {
      formData.append(key, value);
    } else if (includeEmptyOptionals && ['brand', 'description', 'estimated_value', 'asking_price'].includes(key)) {
      formData.append(key, '');
    }
  }

  if (values.photo) {
    formData.append('photo', {
      uri: values.photo.uri,
      name: values.photo.fileName ?? values.photo.uri.split('/').pop() ?? 'photo.jpg',
      type: values.photo.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
  }

  return formData;
}

export async function getItems(): Promise<Item[]> {
  const response = await api.get<ItemsResponse>('/items');
  return response.data.data;
}

export async function getItem(id: number): Promise<Item> {
  const response = await api.get<ItemResponse>(`/items/${id}`);
  return response.data.data;
}

export async function createItem(values: ItemFormValues): Promise<Item> {
  const response = await api.post<ItemResponse>('/items', buildItemFormData(values));
  return response.data.data;
}

export async function updateItem(id: number, values: ItemFormValues): Promise<Item> {
  const formData = buildItemFormData(values, true);
  formData.append('_method', 'PUT');
  const response = await api.post<ItemResponse>(`/items/${id}`, formData);
  return response.data.data;
}

export async function deleteItem(id: number): Promise<void> {
  await api.delete(`/items/${id}`);
}
