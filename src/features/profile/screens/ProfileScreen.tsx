import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import ItemCard from '@/src/features/items/components/ItemCard';
import { useItems } from '@/src/features/items/api/itemsHooks';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const profileImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'mine' | 'saved' | 'liked'>('mine');
  const mineQuery = useItems({ mine: true }, activeTab === 'mine');
  const savedQuery = useItems({ saved: true }, activeTab === 'saved');
  const likedQuery = useItems({ liked: true }, activeTab === 'liked');
  const activeQuery = activeTab === 'mine' ? mineQuery : activeTab === 'saved' ? savedQuery : likedQuery;
  const mineItems = mineQuery.data ?? [];
  const activeItems = activeQuery.data ?? [];
  const emptyMessage = activeTab === 'saved'
    ? 'Você ainda não salvou nenhum item.'
    : activeTab === 'liked'
      ? 'Você ainda não curtiu nenhum item.'
      : 'Sua coleção ainda está vazia.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        <Text style={styles.username}>@colecionista</Text>
        <Text style={styles.bio}>Colecionador de itens raros, figuras e jogos retrô.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{mineItems.length}</Text>
          <Text style={styles.statLabel}>itens</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{mineItems.filter((item) => item.availability === 'venda').length}</Text>
          <Text style={styles.statLabel}>à venda</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{mineItems.filter((item) => item.availability === 'troca').length}</Text>
          <Text style={styles.statLabel}>trocas</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <ProfileTab label="Meus itens" selected={activeTab === 'mine'} onPress={() => setActiveTab('mine')} />
        <ProfileTab label="Salvos" selected={activeTab === 'saved'} onPress={() => setActiveTab('saved')} />
        <ProfileTab label="Curtidos" selected={activeTab === 'liked'} onPress={() => setActiveTab('liked')} />
      </View>
      <Text style={styles.collectionTitle}>{activeTab === 'mine' ? 'Minha coleção' : activeTab === 'saved' ? 'Itens salvos' : 'Itens curtidos'}</Text>
      <FlatList
        data={activeItems}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ItemCard item={item} isOwner={activeTab === 'mine'} />}
        ListEmptyComponent={activeQuery.isLoading
          ? <LoadingState message="Carregando itens..." />
          : activeQuery.isError
            ? <ErrorState message={getApiError(activeQuery.error).message} onRetry={() => { void activeQuery.refetch(); }} />
            : <EmptyState message={emptyMessage} />}
      />
    </View>
  );
}

function ProfileTab({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.tab, selected && styles.tabSelected]}>
      <Text style={[styles.tabText, selected && styles.tabTextSelected]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: theme.spacing.md,
  },
  username: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  bio: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  statNumber: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    textTransform: 'lowercase',
  },
  collectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  tabs: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.xs, marginBottom: theme.spacing.lg },
  tab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xs, borderRadius: theme.radius.sm },
  tabSelected: { backgroundColor: theme.colors.primary },
  tabText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  tabTextSelected: { color: '#081018' },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
});
