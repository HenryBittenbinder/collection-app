import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import ItemCard from '@/src/features/items/components/ItemCard';
import { useItems } from '@/src/features/items/api/itemsHooks';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const profileImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

export default function ProfileScreen() {
  const { data: items = [], isLoading, isError, error, refetch } = useItems();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        <Text style={styles.username}>@colecionista</Text>
        <Text style={styles.bio}>Colecionador de itens raros, figuras e jogos retrô.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>itens</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{items.filter((item) => item.availability === 'venda').length}</Text>
          <Text style={styles.statLabel}>à venda</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{items.filter((item) => item.availability === 'troca').length}</Text>
          <Text style={styles.statLabel}>trocas</Text>
        </View>
      </View>

      <Text style={styles.collectionTitle}>Minha coleção</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ItemCard item={item} isOwner />}
        ListEmptyComponent={isLoading
          ? <LoadingState message="Carregando coleção..." />
          : isError
            ? <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} />
            : <EmptyState />}
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
});
