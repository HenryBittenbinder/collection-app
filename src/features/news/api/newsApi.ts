import api from '@/src/shared/lib/api';
import { newsListSchema, newsSchema } from '@/src/features/news/schemas/newsSchema';
import type { News } from '@/src/features/news/types/news';

type NewsListResponse = { data: unknown };
type NewsResponse = { data: unknown };

export async function getNews(): Promise<News[]> {
  const response = await api.get<NewsListResponse>('/news');
  return newsListSchema.parse(response.data.data);
}

export async function getNewsItem(id: number): Promise<News> {
  const response = await api.get<NewsResponse>(`/news/${id}`);
  return newsSchema.parse(response.data.data);
}
