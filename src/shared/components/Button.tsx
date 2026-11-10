import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import theme from '@/src/shared/theme/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, icon, style, textStyle }: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;
  const animate = (toValue: number) => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 30, bounciness: 3 }).start();

  const content = (
    <View style={styles.content}>
      {loading ? <ActivityIndicator color={variant === 'primary' ? '#211707' : theme.colors.primary} /> : icon ? <Ionicons name={icon} size={18} color={variant === 'primary' ? '#211707' : theme.colors.text} /> : null}
      {!loading ? <Text style={[styles.label, variant !== 'primary' && styles.secondaryLabel, textStyle]}>{title}</Text> : null}
    </View>
  );

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }, style]}>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: isDisabled }} disabled={isDisabled} onPress={onPress} onPressIn={() => { setPressed(true); animate(0.97); }} onPressOut={() => { setPressed(false); animate(1); }} style={[styles.button, styles[variant], pressed && styles.pressed, isDisabled && styles.disabled]}>
        {variant === 'primary'
          ? <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
          : null}
        <View pointerEvents="none" style={[styles.topHighlight, variant === 'ghost' && styles.ghostHighlight]} />
        {pressed ? <View pointerEvents="none" style={styles.pressShade} /> : null}
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch' },
  button: { minHeight: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: theme.radius.md, borderWidth: 1, ...theme.shadows.button },
  primary: { backgroundColor: theme.colors.primary, borderColor: '#F3CF81', borderBottomColor: '#9B6C20' },
  secondary: { backgroundColor: theme.colors.surfaceElevated, borderColor: '#333743', borderBottomColor: '#08090C' },
  ghost: { backgroundColor: 'transparent', borderColor: theme.colors.border, borderBottomColor: '#090A0D', shadowOpacity: 0, elevation: 0 },
  pressed: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.16, shadowRadius: 2, elevation: 1 },
  pressShade: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.08)' },
  topHighlight: { position: 'absolute', top: 0, left: 8, right: 8, height: 1, backgroundColor: 'rgba(255,255,255,0.48)' },
  ghostHighlight: { backgroundColor: 'rgba(255,255,255,0.14)' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
  label: { color: '#211707', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  secondaryLabel: { color: theme.colors.text, fontWeight: '700' },
  disabled: { opacity: 0.62 },
});
