import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import theme from '@/src/shared/theme/theme';

type ActionButtonProps = {
  icon: 'heart' | 'heart-outline' | 'bookmark' | 'bookmark-outline';
  label: string;
  color: string;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  compact?: boolean;
};

export default function ActionButton({ icon, label, color, onPress, accessibilityLabel, disabled = false, compact = false }: ActionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const animateScale = (toValue: number) => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 35, bounciness: 4 }).start();

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animateScale(0.94)}
        onPressOut={() => animateScale(1)}
        style={[styles.button, compact ? styles.compactButton : styles.detailButton]}
      >
        <Ionicons name={icon} size={compact ? 17 : 22} color={color} />
        <Text style={[styles.label, compact ? styles.compactLabel : styles.detailLabel, { color }]} numberOfLines={1}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  button: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  compactButton: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.xs },
  detailButton: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  label: { textAlign: 'center', marginTop: 2 },
  compactLabel: { fontSize: 10, fontWeight: '600' },
  detailLabel: { fontSize: 12, fontWeight: '600' },
});
