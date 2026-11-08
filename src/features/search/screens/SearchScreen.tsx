import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ItemCard from '@/src/features/items/components/ItemCard';
import { mockItems } from '@/src/features/items/data/mockItems';
import theme from '@/src/shared/theme/theme';

const categoryOptions = ['Todos', ...Array.from(new Set(mockItems.map((item) => item.categoria)))];
const availabilityOptions = ['Todos', 'exibicao', 'venda', 'troca'];
const priceOptions = ['Qualquer', 'Até R$ 200', 'Até R$ 500', 'Acima de R$ 500'];

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedAvailability, setSelectedAvailability] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('Qualquer');

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesName = item.nome.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || item.categoria === selectedCategory;
      const matchesAvailability =
        selectedAvailability === 'Todos' || item.disponibilidade === selectedAvailability;

      const matchesPrice = (() => {
        switch (selectedPrice) {
          case 'Até R$ 200':
            return item.precoDesejado <= 200;
          case 'Até R$ 500':
            return item.precoDesejado <= 500;
          case 'Acima de R$ 500':
            return item.precoDesejado > 500;
          default:
            return true;
        }
      })();

      return matchesName && matchesCategory && matchesAvailability && matchesPrice;
    });
  }, [search, selectedCategory, selectedAvailability, selectedPrice]);

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nome"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.searchInput}
      />

      <Text style={styles.sectionTitle}>Categoria</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        {categoryOptions.map((category) => {
          const active = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Disponibilidade</Text>
      <View style={styles.inlineRow}>
        {availabilityOptions.map((option) => {
          const active = selectedAvailability === option;
          return (
            <Pressable
              key={option}
              onPress={() => setSelectedAvailability(option)}
              style={[styles.inlineButton, active && styles.inlineButtonActive]}
            >
              <Text style={[styles.inlineButtonText, active && styles.inlineButtonTextActive]}>
                {option === 'Todos' ? 'Todos' : option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Faixa de preço</Text>
      <View style={styles.inlineRow}>
        {priceOptions.map((option) => {
          const active = selectedPrice === option;
          return (
            <Pressable
              key={option}
              onPress={() => setSelectedPrice(option)}
              style={[styles.inlineButton, active && styles.inlineButtonActive]}
            >
              <Text style={[styles.inlineButtonText, active && styles.inlineButtonTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.resultText}>{filteredItems.length} itens encontrados</Text>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 15,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    height: 36,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterChipTextActive: {
    color: '#081018',
  },
  inlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  inlineButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  inlineButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  inlineButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  inlineButtonTextActive: {
    color: '#081018',
  },
  resultText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: theme.spacing.sm,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
});
