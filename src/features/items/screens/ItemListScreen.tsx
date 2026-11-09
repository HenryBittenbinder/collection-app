import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ItemCard from '@/src/features/items/components/ItemCard';
import { useItems } from '@/src/features/items/api/itemsHooks';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function ItemListScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { data: items = [], isLoading, isError, error, refetch, isRefetching } = useItems();

  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [items, search, selectedCategory]);

  if (isLoading) return <LoadingState message="Carregando itens..." />;
  if (isError) return <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} />;

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nome"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.searchInput}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={{ flexGrow: 0 }}>
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <Pressable key={category} onPress={() => setSelectedCategory(category)} style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]} numberOfLines={1}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={filteredItems.length ? styles.columnWrapper : undefined}
        contentContainerStyle={[styles.listContent, filteredItems.length === 0 && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { void refetch(); }} tintColor={theme.colors.primary} colors={[theme.colors.primary]} />}
        ListEmptyComponent={<EmptyState message={items.length === 0 ? 'Nenhum item cadastrado ainda' : 'Nenhum item encontrado com esses filtros.'} />}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
  searchInput: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, color: theme.colors.text, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, marginBottom: theme.spacing.md, fontSize: 15 },
  filters: { paddingBottom: theme.spacing.md },
  filterChip: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, height: 36, minWidth: 80, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.sm },
  filterChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterChipText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600', textAlign: 'center', includeFontPadding: false },
  filterChipTextActive: { color: '#081018' },
  columnWrapper: { justifyContent: 'space-between' },
  listContent: { paddingBottom: theme.spacing.xxl },
  emptyContent: { flexGrow: 1 },
});
