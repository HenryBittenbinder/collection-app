import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/features/auth/components/AuthProvider';
import { useRegister } from '@/src/features/auth/api/authHooks';
import { registerSchema, type RegisterFormValues } from '@/src/features/auth/schemas/registerSchema';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function RegisterScreen() {
  const { establishSession } = useAuth();
  const registerMutation = useRegister();
  const [requestError, setRequestError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors }, setError } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: { name: '', username: '', email: '', password: '', password_confirmation: '' },
  });

  const submit = handleSubmit(async (values) => {
    setRequestError(null);
    try {
      const session = await registerMutation.mutateAsync(values);
      await establishSession(session);
    } catch (error) {
      const parsed = getApiError(error);
      setRequestError(parsed.message);
      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (['name', 'username', 'email', 'password', 'password_confirmation'].includes(field)) {
          setError(field as keyof RegisterFormValues, { type: 'server', message });
        }
      }
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.mark}><Text style={styles.markText}>C</Text></View>
          <Text style={styles.eyebrow}>SUA PRÓXIMA DESCOBERTA</Text>
          <Text style={styles.title}>Crie sua conta.</Text>
          <Text style={styles.subtitle}>Monte seu perfil e encontre outras pessoas que compartilham sua coleção.</Text>
          {requestError ? <Text accessibilityRole="alert" style={styles.bannerError}>{requestError}</Text> : null}
          <AuthField control={control} name="name" label="Nome" placeholder="Como podemos chamar você?" error={errors.name?.message} />
          <AuthField control={control} name="username" label="Nome de usuário" placeholder="sem espaços" autoCapitalize="none" error={errors.username?.message} />
          <AuthField control={control} name="email" label="E-mail" placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          <AuthField control={control} name="password" label="Senha" placeholder="Pelo menos 8 caracteres" secureTextEntry error={errors.password?.message} />
          <AuthField control={control} name="password_confirmation" label="Confirme sua senha" placeholder="Digite a senha novamente" secureTextEntry error={errors.password_confirmation?.message} />
          <Pressable accessibilityRole="button" disabled={registerMutation.isPending} onPress={() => { void submit(); }} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed, registerMutation.isPending && styles.disabled]}>
            {registerMutation.isPending ? <ActivityIndicator color="#081018" /> : <Text style={styles.submitText}>Criar conta</Text>}
          </Pressable>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <Link href="/login" style={styles.link}>Entrar</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthField({ control, name, label, placeholder, error, ...inputProps }: {
  control: ReturnType<typeof useForm<RegisterFormValues>>['control'];
  name: keyof RegisterFormValues;
  label: string;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => (
        <TextInput autoCapitalize={inputProps.autoCapitalize ?? 'sentences'} autoComplete="off" keyboardType={inputProps.keyboardType ?? 'default'} secureTextEntry={inputProps.secureTextEntry} placeholder={placeholder} placeholderTextColor={theme.colors.textMuted} value={String(value ?? '')} onChangeText={onChange} onBlur={onBlur} style={[styles.input, error && styles.inputError]} />
      )} />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl },
  mark: { width: 48, height: 48, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md },
  markText: { fontSize: 25, fontWeight: '900', color: '#081018' },
  eyebrow: { color: theme.colors.primarySoft, fontSize: 11, fontWeight: '800', letterSpacing: 1.7, marginBottom: theme.spacing.sm },
  title: { color: theme.colors.text, fontSize: 30, lineHeight: 36, fontWeight: '800', marginBottom: theme.spacing.sm },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: theme.spacing.md },
  field: { marginTop: theme.spacing.sm },
  label: { color: theme.colors.text, fontSize: 13, fontWeight: '600', marginBottom: theme.spacing.xs },
  input: { minHeight: 48, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, color: theme.colors.text, fontSize: 14 },
  inputError: { borderColor: theme.colors.danger },
  fieldError: { color: theme.colors.danger, fontSize: 12, marginTop: theme.spacing.xs },
  bannerError: { color: theme.colors.danger, fontSize: 14, lineHeight: 20, marginBottom: theme.spacing.sm },
  submitButton: { minHeight: 50, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.lg },
  submitText: { color: '#081018', fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.7 },
  pressed: { opacity: 0.85 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.lg },
  footerText: { color: theme.colors.textSecondary, fontSize: 13 },
  link: { color: theme.colors.primarySoft, fontSize: 13, fontWeight: '700' },
});
