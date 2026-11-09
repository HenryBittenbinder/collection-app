import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useDeleteItem, useItem } from '@/src/features/items/api/itemsHooks';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const availabilityLabels = { exibicao: 'Exibição', venda: 'Venda', troca: 'Troca' };
const availabilityColors = { exibicao: '#FBBF24', venda: '#7C9CFF', troca: '#4ADE80' };
const conditionLabels = { novo: 'Novo', excelente: 'Excelente', bom: 'Bom', regular: 'Regular' };

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[]; from?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);
  const { data: item, isLoading, isError, error, refetch } = useItem(id);
  const deleteMutation = useDeleteItem();
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOwnerView = source === 'profile';

  const deleteItem = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      router.replace('/(tabs)/profile');
    } catch (deleteFailure) {
      setDeleteError(getApiError(deleteFailure).message);
    }
  };

  const askToDelete = () => {
    Alert.alert('Excluir item?', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void deleteItem(); } },
    ]);
  };

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

      {isOwnerView && (
        <View style={styles.ownerActions}>
          {deleteError ? <Text style={styles.deleteError}>{deleteError}</Text> : null}
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              style={styles.editButton}
              onPress={() => router.push({ pathname: '/(tabs)/add', params: { id: String(item.id), from: 'profile' } })}
            >
              <MaterialCommunityIcons name="pencil-outline" size={19} color="#081018" />
              <Text style={styles.editButtonText}>Editar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.deleteButton} onPress={askToDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <ActivityIndicator color="#FFFFFF" /> : <>
                <MaterialCommunityIcons name="trash-can-outline" size={19} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </>}
            </Pressable>
          </View>
        </View>
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
  ownerActions: { paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl },
  actionRow: { flexDirection: 'row', gap: theme.spacing.md },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.md },
  editButtonText: { color: '#081018', fontWeight: '700' },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, backgroundColor: '#9F2D3C', padding: theme.spacing.md, borderRadius: theme.radius.md },
  deleteButtonText: { color: '#FFFFFF', fontWeight: '700' },
  deleteError: { color: theme.colors.danger, fontSize: 14, marginBottom: theme.spacing.md },
});
