import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';
import type { Item } from '@/src/features/items/types/item';

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

type ItemCardProps = {
  item: Item;
  isOwner?: boolean;
};

export default function ItemCard({ item, isOwner = false }: ItemCardProps) {
  return (
    <Link href={{ pathname: '/item/[id]', params: { id: String(item.id), ...(isOwner ? { from: 'profile' } : {}) } }} asChild>
      <Pressable style={styles.card}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.photoPlaceholder]}>
            <MaterialCommunityIcons name="image-off-outline" size={36} color={theme.colors.textMuted} />
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>{item.category}</Text>
            <View
              style={[styles.badge, { backgroundColor: availabilityColors[item.availability] }]}
            >
              <Text style={styles.badgeText}>{availabilityLabels[item.availability]}</Text>
            </View>
          </View>

          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.marca}>{item.brand ?? ''}</Text>
          {item.asking_price !== null && <Text style={styles.price}>{formatCurrency(item.asking_price)}</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    margin: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  category: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  marca: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: theme.spacing.sm,
  },
  price: {
    color: theme.colors.primarySoft,
    fontSize: 14,
    fontWeight: '700',
  },
});

function formatCurrency(value: string) {
  const amount = Number(value.replace(',', '.'));
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
    : value;
}
