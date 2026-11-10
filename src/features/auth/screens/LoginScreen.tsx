import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/features/auth/components/AuthProvider';
import { loginSchema, type LoginFormValues } from '@/src/features/auth/schemas/loginSchema';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setRequestError(null);
    setIsSubmitting(true);
    try {
      await signIn(values);
    } catch (error) {
      setRequestError(getApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.mark}><Text style={styles.markText}>C</Text></View>
          <Text style={styles.eyebrow}>COLLECTION</Text>
          <Text style={styles.title}>Que bom ter você de volta.</Text>
          <Text style={styles.subtitle}>Entre na sua conta para explorar coleções e conversar com outros colecionadores.</Text>

          {requestError ? <Text accessibilityRole="alert" style={styles.bannerError}>{requestError}</Text> : null}
          <Text style={styles.label}>E-mail</Text>
          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="voce@exemplo.com" placeholderTextColor={theme.colors.textMuted} value={value} onChangeText={onChange} onBlur={onBlur} style={[styles.input, errors.email && styles.inputError]} />
          )} />
          {errors.email ? <Text style={styles.fieldError}>{errors.email.message}</Text> : null}

          <Text style={styles.label}>Senha</Text>
          <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput autoCapitalize="none" secureTextEntry placeholder="Sua senha" placeholderTextColor={theme.colors.textMuted} value={value} onChangeText={onChange} onBlur={onBlur} style={[styles.input, errors.password && styles.inputError]} />
          )} />
          {errors.password ? <Text style={styles.fieldError}>{errors.password.message}</Text> : null}

          <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={() => { void submit(); }} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed, isSubmitting && styles.disabled]}>
            {isSubmitting ? <ActivityIndicator color="#081018" /> : <Text style={styles.submitText}>Entrar</Text>}
          </Pressable>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
            <Link href="/cadastro" style={styles.link}>Criar conta</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.xl },
  mark: { width: 54, height: 54, borderRadius: 18, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg },
  markText: { fontSize: 28, fontWeight: '900', color: '#081018' },
  eyebrow: { color: theme.colors.primarySoft, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: theme.spacing.sm },
  title: { color: theme.colors.text, fontSize: 30, lineHeight: 36, fontWeight: '800', marginBottom: theme.spacing.sm },
  subtitle: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: theme.spacing.xl },
  label: { color: theme.colors.text, fontSize: 14, fontWeight: '600', marginBottom: theme.spacing.sm, marginTop: theme.spacing.md },
  input: { minHeight: 52, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, color: theme.colors.text, fontSize: 15 },
  inputError: { borderColor: theme.colors.danger },
  fieldError: { color: theme.colors.danger, fontSize: 12, marginTop: theme.spacing.xs },
  bannerError: { color: theme.colors.danger, fontSize: 14, lineHeight: 20, marginBottom: theme.spacing.sm },
  submitButton: { minHeight: 52, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.xl },
  submitText: { color: '#081018', fontSize: 16, fontWeight: '800' },
  disabled: { opacity: 0.7 },
  pressed: { opacity: 0.85 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.xl },
  footerText: { color: theme.colors.textSecondary, fontSize: 14 },
  link: { color: theme.colors.primarySoft, fontSize: 14, fontWeight: '700' },
});
