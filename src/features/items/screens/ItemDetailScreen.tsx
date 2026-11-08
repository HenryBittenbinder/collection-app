import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { mockItems } from '@/src/features/items/data/mockItems';
import theme from '@/src/shared/theme/theme';

const availabilityLabels = {
  exibicao: 'Exibição',
  venda: 'Venda',
  troca: 'Troca',
};

const availabilityColors = {
  exibicao: '#FBBF24',
  venda: '#7C9CFF',
  troca: '#4ADE80',
};

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const item = mockItems.find((current) => current.id === params.id);

  if (!item) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Item não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: item.fotoUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.header}>
        <Text style={styles.category}>{item.categoria}</Text>
        <View
          style={[styles.badge, { backgroundColor: availabilityColors[item.disponibilidade] }]}
        >
          <Text style={styles.badgeText}>{availabilityLabels[item.disponibilidade]}</Text>
        </View>
      </View>

      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.marca}>{item.marca}</Text>

      <View style={styles.infoGrid}>
        <View style={[styles.infoBox, styles.infoBoxFirst]}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>{item.estadoConservacao}</Text>
        </View>
        <View style={[styles.infoBox, styles.infoBoxLast]}>
          <Text style={styles.label}>Valor</Text>
          <Text style={styles.value}>R$ {item.valorEstimado.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.label}>Preço desejado</Text>
        <Text style={styles.price}>R$ {item.precoDesejado.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.description}>{item.descricao}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  category: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    color: '#081018',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  name: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.lg,
  },
  marca: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  infoBoxFirst: {
    marginRight: theme.spacing.md,
  },
  infoBoxLast: {
    marginLeft: 0,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  priceBox: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  price: {
    color: theme.colors.primarySoft,
    fontSize: 28,
    fontWeight: '700',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 18,
  },
});
