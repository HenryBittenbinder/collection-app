import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useItem } from '@/src/features/items/api/itemsHooks';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const availabilityLabels = { exibicao: 'Exibição', venda: 'Venda', troca: 'Troca' };
const availabilityColors = { exibicao: '#FBBF24', venda: '#7C9CFF', troca: '#4ADE80' };
const conditionLabels = { novo: 'Novo', excelente: 'Excelente', bom: 'Bom', regular: 'Regular' };

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);
  const { data: item, isLoading, isError, error, refetch } = useItem(id);

  if (isLoading) return <LoadingState message="Carregando item..." />;
  if (isError || !item) {
    return <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.photoPlaceholder]}>
          <MaterialCommunityIcons name="image-off-outline" size={48} color={theme.colors.textMuted} />
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.category}>{item.category}</Text>
        <View style={[styles.badge, { backgroundColor: availabilityColors[item.availability] }]}>
          <Text style={styles.badgeText}>{availabilityLabels[item.availability]}</Text>
        </View>
      </View>

      <Text style={styles.name}>{item.name}</Text>
      {item.brand !== null && <Text style={styles.brand}>{item.brand}</Text>}

      <View style={styles.infoGrid}>
        <View style={[styles.infoBox, styles.infoBoxFirst]}>
          <Text style={styles.label}>Condição</Text>
          <Text style={styles.value}>{conditionLabels[item.condition]}</Text>
        </View>
        {item.estimated_value !== null && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Valor estimado</Text>
            <Text style={styles.value}>{formatCurrency(item.estimated_value)}</Text>
          </View>
        )}
      </View>

      {item.asking_price !== null && (
        <View style={styles.priceBox}>
          <Text style={styles.label}>Preço pedido</Text>
          <Text style={styles.price}>{formatCurrency(item.asking_price)}</Text>
        </View>
      )}

      {item.description !== null && (
        <>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{item.description}</Text>
        </>
      )}
    </ScrollView>
  );
}

function formatCurrency(value: string) {
  const amount = Number(value.replace(',', '.'));
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
    : value;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: theme.spacing.xxl },
  image: { width: '100%', aspectRatio: 1, borderRadius: theme.radius.lg, marginTop: theme.spacing.lg },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  category: { color: theme.colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  badge: { paddingHorizontal: theme.spacing.md, paddingVertical: 6, borderRadius: theme.radius.pill },
  badgeText: { color: '#081018', fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  name: { color: theme.colors.text, fontSize: 28, fontWeight: '700', paddingHorizontal: theme.spacing.lg },
  brand: { color: theme.colors.textSecondary, fontSize: 14, paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  infoGrid: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  infoBox: { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md },
  infoBoxFirst: { marginRight: theme.spacing.md },
  label: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: theme.spacing.xs, textTransform: 'uppercase' },
  value: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  priceBox: { marginHorizontal: theme.spacing.lg, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.lg },
  price: { color: theme.colors.primarySoft, fontSize: 28, fontWeight: '700' },
  sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.sm },
  description: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 24, paddingHorizontal: theme.spacing.lg },
});
