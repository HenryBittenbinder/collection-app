import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import type { Item, ItemAvailability, ItemCondition } from '@/src/features/items/types/item';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

type Filters = { category: string; condition: ItemCondition | ''; availability: ItemAvailability | '' };
const emptyFilters: Filters = { category: '', condition: '', availability: '' };
const conditionOptions: Array<{ value: ItemCondition; label: string }> = [
  { value: 'novo', label: 'Novo' },
  { value: 'excelente', label: 'Excelente' },
  { value: 'bom', label: 'Bom' },
  { value: 'regular', label: 'Regular' },
];
const availabilityOptions: Array<{ value: ItemAvailability; label: string }> = [
  { value: 'exibicao', label: 'Exibição' },
  { value: 'venda', label: 'Venda' },
  { value: 'troca', label: 'Troca' },
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [panelVisible, setPanelVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const { data: items = [], isLoading, isError, error, refetch, isRefetching } = useItems();
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'pt-BR')), [items]);
  const activeFilters = Number(Boolean(filters.category)) + Number(Boolean(filters.condition)) + Number(Boolean(filters.availability));
  const filteredItems = useMemo(() => filterItems(items, search, filters), [items, search, filters]);

  const openFilters = () => {
    setDraftFilters(filters);
    setPanelVisible(true);
  };
  const applyFilters = () => {
    setFilters(draftFilters);
    setPanelVisible(false);
  };
  const clearFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setPanelVisible(false);
  };

  if (isLoading) return <LoadingState message="Carregando itens..." />;
  if (isError) return <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={19} color={theme.colors.textMuted} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Buscar por nome" placeholderTextColor={theme.colors.textMuted} style={styles.searchInput} returnKeyType="search" />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir filtros" onPress={openFilters} style={styles.filterButton}>
          <Ionicons name="menu" size={25} color={theme.colors.text} />
          {activeFilters > 0 ? <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeFilters}</Text></View> : null}
        </Pressable>
      </View>

      <FlatList
        data={filteredItems.length % 2 === 1 ? [...filteredItems, null] : filteredItems}
        keyExtractor={(item, index) => item ? String(item.id) : `spacer-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[styles.listContent, filteredItems.length === 0 && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { void refetch(); }} tintColor={theme.colors.primary} colors={[theme.colors.primary]} />}
        ListHeaderComponent={<Text style={styles.resultText}>{filteredItems.length} itens encontrados</Text>}
        ListEmptyComponent={<EmptyState message="Nenhum item encontrado." />}
        renderItem={({ item }) => item ? <ItemCard item={item} /> : <View style={styles.cardSpacer} />}
      />

      <Modal visible={panelVisible} transparent animationType="slide" onRequestClose={() => setPanelVisible(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.scrim} onPress={() => setPanelVisible(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Filtros</Text><Pressable onPress={() => setPanelVisible(false)} accessibilityLabel="Fechar filtros"><Ionicons name="close" size={24} color={theme.colors.textSecondary} /></Pressable></View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <FilterGroup title="Categoria" options={categories.map((category) => ({ value: category, label: category }))} value={draftFilters.category} onSelect={(category) => setDraftFilters((current) => ({ ...current, category }))} />
              <FilterGroup title="Condição" options={conditionOptions} value={draftFilters.condition} onSelect={(condition) => setDraftFilters((current) => ({ ...current, condition: condition as ItemCondition }))} />
              <FilterGroup title="Disponibilidade" options={availabilityOptions} value={draftFilters.availability} onSelect={(availability) => setDraftFilters((current) => ({ ...current, availability: availability as ItemAvailability }))} />
            </ScrollView>
            <View style={styles.sheetActions}>
              <Button title="Limpar filtros" variant="secondary" onPress={clearFilters} style={styles.filterActionButton} textStyle={styles.filterActionText} />
              <Button title="Aplicar filtros" onPress={applyFilters} style={styles.filterActionButton} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function FilterGroup({ title, options, value, onSelect }: { title: string; options: Array<{ value: string; label: string }>; value: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = value === option.value;
          return <Pressable key={option.value} onPress={() => onSelect(active ? '' : option.value)} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text></Pressable>;
        })}
      </View>
    </View>
  );
}

function filterItems(items: Item[], search: string, filters: Filters) {
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
  return items.filter((item) =>
    item.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch) &&
    (!filters.category || item.category === filters.category) &&
    (!filters.condition || item.condition === filters.condition) &&
    (!filters.availability || item.availability === filters.availability),
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  searchBox: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md },
  searchInput: { flex: 1, color: theme.colors.text, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.sm, fontSize: 15 },
  filterButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md },
  filterBadge: { position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, borderRadius: 10 },
  filterBadgeText: { color: '#211707', fontSize: 11, fontWeight: '700' },
  resultText: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: theme.spacing.sm },
  columnWrapper: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.xs },
  cardSpacer: { flex: 1, margin: theme.spacing.xs },
  listContent: { paddingBottom: theme.spacing.xxl, paddingHorizontal: theme.spacing.xs },
  emptyContent: { flexGrow: 1 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: '#00000099' },
  sheet: { maxHeight: '82%', backgroundColor: theme.colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl, borderWidth: 1, borderColor: theme.colors.border },
  sheetHandle: { width: 42, height: 4, backgroundColor: theme.colors.textMuted, borderRadius: 2, alignSelf: 'center', marginTop: theme.spacing.md, marginBottom: theme.spacing.md },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  sheetTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
  filterGroup: { marginTop: theme.spacing.md },
  groupTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '700', marginBottom: theme.spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#211707' },
  sheetActions: { flexDirection: 'row', gap: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border },
  filterActionButton: { flex: 1 },
  filterActionText: { fontSize: 13 },
});
