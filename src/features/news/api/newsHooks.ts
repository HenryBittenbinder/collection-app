import { useQuery } from '@tanstack/react-query';

import { getNews, getNewsItem } from '@/src/features/news/api/newsApi';

export const newsQueryKeys = {
  all: ['news'] as const,
  item: (id: number) => ['news', id] as const,
};

export function useNews() {
  return useQuery({ queryKey: newsQueryKeys.all, queryFn: getNews });
}

export function useNewsItem(id: number) {
  return useQuery({ queryKey: newsQueryKeys.item(id), queryFn: () => getNewsItem(id), enabled: Number.isFinite(id) && id > 0 });
}
