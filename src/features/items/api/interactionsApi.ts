import api from '@/src/shared/lib/api';

type ToggleLikeResponse = { data: { liked: boolean; likes_count: number } };
type ToggleSaveResponse = { data: { saved: boolean } };

export async function toggleLike(itemId: number): Promise<ToggleLikeResponse['data']> {
  const response = await api.post<ToggleLikeResponse>(`/items/${itemId}/like`);
  return response.data.data;
}

export async function toggleSave(itemId: number): Promise<ToggleSaveResponse['data']> {
  const response = await api.post<ToggleSaveResponse>(`/items/${itemId}/save`);
  return response.data.data;
}
