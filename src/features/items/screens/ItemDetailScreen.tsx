import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import CommentsSection from '@/src/features/comments/components/CommentsSection';
import CommentComposer from '@/src/features/comments/components/CommentComposer';
import { useToggleLike, useToggleSave } from '@/src/features/items/api/interactionHooks';
import { useStartConversation } from '@/src/features/chat/api/chatHooks';
import { useDeleteItem, useItem } from '@/src/features/items/api/itemsHooks';
import ActionButton from '@/src/shared/components/ActionButton';
import Button from '@/src/shared/components/Button';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import BackButton from '@/src/shared/components/BackButton';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const availabilityLabels = { exibicao: 'Exibição', venda: 'Venda', troca: 'Troca' };
const availabilityColors = { exibicao: theme.colors.primary, venda: theme.colors.primaryDark, troca: theme.colors.success };
const conditionLabels = { novo: 'Novo', excelente: 'Excelente', bom: 'Bom', regular: 'Regular' };

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[]; from?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);
  const { data: item, isLoading, isError, error, refetch } = useItem(id);
  const deleteMutation = useDeleteItem();
  const likeMutation = useToggleLike();
  const saveMutation = useToggleSave();
  const startConversationMutation = useStartConversation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const askToDelete = () => {
    setDeleteError(null);
    setConfirmDelete(true);
  };

  const detailHeader = (
    <View style={[styles.backHeader, { paddingTop: insets.top + theme.spacing.sm }]}>
      <BackButton />
      <View style={styles.titleBlock}>
        {item ? <Text style={styles.headerCategory} numberOfLines={1}>{item.category}</Text> : null}
        <Text style={styles.headerTitle} numberOfLines={1}>{item?.name ?? 'Item'}</Text>
      </View>
      {item?.is_mine ? (
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar item"
            style={styles.headerActionButton}
            hitSlop={12}
            onPress={() => router.push({ pathname: '/(tabs)/add', params: { id: String(item.id), from: 'profile' } })}
          >
            <MaterialCommunityIcons name="pencil-outline" size={24} color={theme.colors.primary} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Excluir item" style={styles.headerActionButton} hitSlop={12} onPress={askToDelete} disabled={deleteMutation.isPending || confirmDelete}>
            {deleteMutation.isPending ? <ActivityIndicator color={theme.colors.text} /> : <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.danger} />}
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const deleteItem = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      setConfirmDelete(false);
      if (source === 'profile') router.back();
      else router.replace('/(tabs)/profile');
    } catch (deleteFailure) {
      setDeleteError(getApiError(deleteFailure).message);
    }
  };

  const openConversation = async () => {
    try {
      const conversation = await startConversationMutation.mutateAsync(id);
      router.push({ pathname: '/chat/[id]', params: { id: String(conversation.id) } });
    } catch {
      // O erro da API é mostrado abaixo do botão.
    }
  };

  if (isLoading) return <View style={styles.container}>{detailHeader}<LoadingState message="Carregando item..." /></View>;
  if (isError || !item) {
    return <View style={styles.container}>{detailHeader}<ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} /></View>;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false }} />
    {detailHeader}
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
      <View style={styles.interactionRow}>
        <ActionButton icon={item.liked_by_me ? 'heart' : 'heart-outline'} label={`${item.likes_count} ${item.likes_count === 1 ? 'curtida' : 'curtidas'}`} accessibilityLabel={item.liked_by_me ? 'Descurtir item' : 'Curtir item'} color={item.liked_by_me ? theme.colors.danger : theme.colors.textSecondary} disabled={likeMutation.isPending} onPress={() => likeMutation.mutate(item.id)} />
        <ActionButton icon={item.saved_by_me ? 'bookmark' : 'bookmark-outline'} label={item.saved_by_me ? 'Salvo' : 'Salvar'} accessibilityLabel={item.saved_by_me ? 'Remover item dos salvos' : 'Salvar item'} color={item.saved_by_me ? theme.colors.primary : theme.colors.textSecondary} disabled={saveMutation.isPending} onPress={() => saveMutation.mutate(item.id)} />
      </View>
      <View style={styles.ownerRow}>
        {item.owner.avatar ? <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} /> : <View style={[styles.ownerAvatar, styles.ownerFallback]}><Text style={styles.ownerInitial}>{item.owner.name.charAt(0).toUpperCase()}</Text></View>}
        <View><Text style={styles.ownerName}>{item.owner.name}</Text><Text style={styles.ownerUsername}>@{item.owner.username}</Text></View>
      </View>
      {!item.is_mine ? (
        <View style={styles.contactOwner}>
          {startConversationMutation.isError ? <Text style={styles.contactError}>{getApiError(startConversationMutation.error).message}</Text> : null}
          <Button title="Conversar com o dono" icon="chatbubble-ellipses-outline" loading={startConversationMutation.isPending} onPress={() => { void openConversation(); }} style={styles.contactButton} />
        </View>
      ) : null}
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

      <CommentsSection itemId={item.id} />
    </ScrollView>
    <CommentComposer itemId={item.id} />
    <Modal visible={confirmDelete} transparent animationType="fade" onRequestClose={() => setConfirmDelete(false)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>Excluir item</Text>
          <Text style={styles.confirmText}>Essa ação não pode ser desfeita. Deseja excluir este item?</Text>
          {deleteError ? <Text style={styles.deleteError}>{deleteError}</Text> : null}
          <View style={styles.confirmActions}>
            <Pressable onPress={() => { setConfirmDelete(false); setDeleteError(null); }} style={styles.cancelButton} disabled={deleteMutation.isPending}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={() => { void deleteItem(); }} style={styles.confirmDeleteButton} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.deleteButtonText}>Excluir</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </KeyboardAvoidingView>
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
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  backHeader: { flexDirection: 'row', alignItems: 'center', paddingLeft: theme.spacing.lg, paddingRight: theme.spacing.lg, paddingBottom: theme.spacing.sm, gap: theme.spacing.sm, zIndex: 2, elevation: 2 },
  content: { paddingBottom: 140 },
  titleBlock: { flex: 1, minWidth: 0, justifyContent: 'center' },
  headerCategory: { color: theme.colors.textSecondary, fontSize: 11, marginBottom: 2 },
  headerTitle: { flex: 1, color: theme.colors.text, fontSize: 17, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginRight: theme.spacing.lg },
  headerActionButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: theme.colors.surfaceElevated, borderWidth: 1, borderColor: '#333743', borderTopColor: '#525866', borderBottomColor: '#08090C', ...theme.shadows.button },
  image: { width: '100%', aspectRatio: 1, borderRadius: theme.radius.lg, marginTop: theme.spacing.lg },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  category: { color: theme.colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  badge: { paddingHorizontal: theme.spacing.md, paddingVertical: 6, borderRadius: theme.radius.pill },
  badgeText: { color: '#081018', fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  name: { color: theme.colors.text, fontSize: 28, fontWeight: '700', paddingHorizontal: theme.spacing.lg },
  interactionRow: { flexDirection: 'row', alignItems: 'stretch', gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.sm },
  brand: { color: theme.colors.textSecondary, fontSize: 14, paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  ownerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg },
  ownerAvatar: { width: 42, height: 42, borderRadius: 21, marginRight: theme.spacing.md },
  ownerFallback: { backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  ownerInitial: { color: theme.colors.text, fontWeight: '700', fontSize: 16 },
  ownerName: { color: theme.colors.text, fontWeight: '700' },
  ownerUsername: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  contactOwner: { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  contactButton: { marginTop: theme.spacing.xs },
  contactError: { color: theme.colors.danger, fontSize: 13, marginBottom: theme.spacing.sm },
  infoGrid: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  infoBox: { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md },
  infoBoxFirst: { marginRight: theme.spacing.md },
  label: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: theme.spacing.xs, textTransform: 'uppercase' },
  value: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  priceBox: { marginHorizontal: theme.spacing.lg, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.lg },
  price: { color: theme.colors.primarySoft, fontSize: 28, fontWeight: '700' },
  sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.sm },
  description: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 24, paddingHorizontal: theme.spacing.lg },
  cancelButtonText: { color: theme.colors.text, fontWeight: '700' },
  deleteButtonText: { color: '#FFFFFF', fontWeight: '700' },
  deleteError: { color: theme.colors.danger, fontSize: 14, marginBottom: theme.spacing.md },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.72)', justifyContent: 'center', padding: theme.spacing.xl },
  confirmBox: { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.lg, padding: theme.spacing.lg },
  confirmTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: theme.spacing.sm },
  confirmText: { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, lineHeight: 21 },
  confirmActions: { flexDirection: 'row', gap: theme.spacing.sm },
  cancelButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing.md, borderRadius: theme.radius.md, minHeight: 48 },
  confirmDeleteButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8F3540', padding: theme.spacing.md, borderRadius: theme.radius.md, minHeight: 48 },
});
