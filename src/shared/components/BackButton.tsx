import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import theme from '@/src/shared/theme/theme';

export default function BackButton() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  const animate = (toValue: number) => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 30, bounciness: 3 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={12}
        onPress={() => router.back()}
        onPressIn={() => { setPressed(true); animate(0.94); }}
        onPressOut={() => { setPressed(false); animate(1); }}
        style={[styles.button, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceElevated, borderWidth: 1, borderColor: '#333743', borderTopColor: '#525866', borderBottomColor: '#08090C', ...theme.shadows.button },
  pressed: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.16, shadowRadius: 2, elevation: 1 },
});
