import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { useAuth } from '@/src/features/auth/components/AuthProvider';
import ItemCard from '@/src/features/items/components/ItemCard';
import { useItems } from '@/src/features/items/api/itemsHooks';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'mine' | 'saved' | 'liked'>('mine');
  const [logoutVisible, setLogoutVisible] = useState(false);
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
        <View style={styles.profileActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Editar perfil" onPress={() => router.push('/editar-perfil')} style={styles.actionButton}>
            <Ionicons name="create-outline" size={22} color={theme.colors.text} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={() => setLogoutVisible(true)} style={styles.actionButton}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.text} />
          </Pressable>
        </View>
        {user?.avatar
          ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
          : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{user?.name.trim().charAt(0).toLocaleUpperCase('pt-BR') || '?'}</Text></View>}
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
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
      <Modal visible={logoutVisible} transparent animationType="fade" onRequestClose={() => setLogoutVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.logoutIcon}><Ionicons name="log-out-outline" size={26} color={theme.colors.danger} /></View>
            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalMessage}>Você precisará entrar novamente para acessar sua coleção.</Text>
            <Button title="Sair" onPress={() => { setLogoutVisible(false); void signOut(); }} style={styles.logoutConfirm} />
            <Button title="Cancelar" variant="ghost" onPress={() => setLogoutVisible(false)} style={styles.logoutCancel} />
          </View>
        </View>
      </Modal>
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
    paddingTop: theme.spacing.xl,
  },
  profileActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: theme.spacing.md,
  },
  username: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  name: { color: theme.colors.text, fontSize: 22, fontWeight: '800', marginBottom: theme.spacing.xs },
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
  tabTextSelected: { color: '#211707' },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  avatarFallback: { backgroundColor: theme.colors.surfaceAlt, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: theme.colors.primarySoft, fontSize: 32, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  modalCard: { width: '100%', maxWidth: 360, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.xl, padding: theme.spacing.xl, alignItems: 'center' },
  logoutIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(248,113,113,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md },
  modalTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800', marginBottom: theme.spacing.sm },
  modalMessage: { color: theme.colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: theme.spacing.lg },
  logoutConfirm: { alignSelf: 'stretch' },
  logoutCancel: { marginTop: theme.spacing.xs },
});
