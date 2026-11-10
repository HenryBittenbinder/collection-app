import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';

import { toggleLike, toggleSave } from './interactionsApi';
import { itemQueryKeys } from './itemsHooks';
import type { Item } from '@/src/features/items/types/item';

type CacheSnapshot = Array<[QueryKey, unknown]>;

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleLike,
    onMutate: async (itemId): Promise<CacheSnapshot> => {
      await queryClient.cancelQueries({ queryKey: itemQueryKeys.all });
      const snapshots = queryClient.getQueriesData({ queryKey: itemQueryKeys.all });
      updateItemCaches(queryClient, itemId, (item) => ({
        ...item,
        liked_by_me: !item.liked_by_me,
        likes_count: Math.max(0, item.likes_count + (item.liked_by_me ? -1 : 1)),
      }));
      return snapshots;
    },
    onError: (_error, _itemId, snapshots) => restoreItemCaches(queryClient, snapshots),
    onSuccess: (result, itemId) => updateItemCaches(queryClient, itemId, (item) => ({
      ...item,
      liked_by_me: result.liked,
      likes_count: result.likes_count,
    })),
    onSettled: (_result, _error, itemId) => Promise.all([
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.detail(itemId) }),
    ]),
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleSave,
    onMutate: async (itemId): Promise<CacheSnapshot> => {
      await queryClient.cancelQueries({ queryKey: itemQueryKeys.all });
      const snapshots = queryClient.getQueriesData({ queryKey: itemQueryKeys.all });
      updateItemCaches(queryClient, itemId, (item) => ({ ...item, saved_by_me: !item.saved_by_me }));
      return snapshots;
    },
    onError: (_error, _itemId, snapshots) => restoreItemCaches(queryClient, snapshots),
    onSuccess: (result, itemId) => updateItemCaches(queryClient, itemId, (item) => ({ ...item, saved_by_me: result.saved })),
    onSettled: (_result, _error, itemId) => Promise.all([
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.detail(itemId) }),
    ]),
  });
}

function updateItemCaches(queryClient: ReturnType<typeof useQueryClient>, itemId: number, update: (item: Item) => Item) {
  queryClient.setQueriesData({ queryKey: itemQueryKeys.all }, (data: unknown) => mapCachedItems(data, itemId, update));
}

function restoreItemCaches(queryClient: ReturnType<typeof useQueryClient>, snapshots: CacheSnapshot | undefined) {
  snapshots?.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
}

function mapCachedItems(data: unknown, itemId: number, update: (item: Item) => Item): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => isItem(item) && item.id === itemId ? update(item) : item);
  }

  return isItem(data) && data.id === itemId ? update(data) : data;
}

function isItem(value: unknown): value is Item {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'number';
}
