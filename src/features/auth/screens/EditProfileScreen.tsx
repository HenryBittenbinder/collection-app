import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/features/auth/components/AuthProvider';
import type { ProfilePhoto } from '@/src/features/auth/api/authApi';
import { useUpdateProfile } from '@/src/features/auth/api/authHooks';
import { profileSchema, type ProfileFormValues } from '@/src/features/auth/schemas/profileSchema';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const updateMutation = useUpdateProfile();
  const [avatar, setAvatar] = useState<ProfilePhoto | undefined>();
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { control, handleSubmit, formState: { errors }, reset, setError } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: { name: user?.name ?? '', username: user?.username ?? '', bio: user?.bio ?? '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, username: user.username, bio: user.bio ?? '' });
  }, [reset, user]);

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  const pickAvatar = async () => {
    setBannerError(null);
    setSuccessMessage(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setBannerError('Permita o acesso às fotos nas configurações do celular para escolher um avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      if (asset.fileSize !== null && asset.fileSize !== undefined && asset.fileSize > 4 * 1024 * 1024) {
        setBannerError('A imagem deve ter até 4 MB. Escolha um arquivo menor.');
        return;
      }

      setAvatar({ uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType });
    } catch {
      setBannerError('Não foi possível abrir a galeria. Tente novamente.');
    }
  };

  const submit = handleSubmit(async (values) => {
    setBannerError(null);
    setSuccessMessage(null);
    try {
      await updateMutation.mutateAsync({ values: { ...values, bio: values.bio.trim() }, avatar });
      setAvatar(undefined);
      setSuccessMessage('Seu perfil foi atualizado.');
      successTimer.current = setTimeout(() => router.back(), 1100);
    } catch (error) {
      const parsed = getApiError(error);
      const recognizedFields = new Set(['name', 'username', 'bio', 'avatar']);
      let hasFieldError = false;
      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (recognizedFields.has(field) && field !== 'avatar') {
          setError(field as keyof ProfileFormValues, { type: 'server', message });
          hasFieldError = true;
        }
      }
      setBannerError(parsed.fieldErrors.avatar ?? (hasFieldError ? null : parsed.message));
    }
  });

  const displayAvatar = avatar?.uri ?? user?.avatar;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.avatarBlock}>
            {displayAvatar
              ? <Image source={{ uri: displayAvatar }} style={styles.avatar} />
              : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{user?.name.trim().charAt(0).toLocaleUpperCase('pt-BR') || '?'}</Text></View>}
            <Pressable accessibilityRole="button" accessibilityLabel="Escolher foto de perfil" onPress={() => { void pickAvatar(); }} style={styles.photoButton}>
              <Ionicons name="camera-outline" size={18} color="#081018" />
            </Pressable>
            <Text style={styles.avatarHint}>Toque para trocar sua foto</Text>
          </View>

          {bannerError ? <Text accessibilityRole="alert" style={styles.bannerError}>{bannerError}</Text> : null}
          {successMessage ? <Text accessibilityLiveRegion="polite" style={styles.successMessage}>{successMessage}</Text> : null}
          <ProfileField control={control} name="name" label="Nome" placeholder="Seu nome" error={errors.name?.message} />
          <ProfileField control={control} name="username" label="Nome de usuário" placeholder="Sem espaços" autoCapitalize="none" error={errors.username?.message} />
          <ProfileField control={control} name="bio" label="Descrição" placeholder="Conte um pouco sobre sua coleção" multiline error={errors.bio?.message} />
          <Text style={styles.counter}>Até 160 caracteres</Text>

          <Button title="Salvar alterações" loading={updateMutation.isPending} onPress={() => { void submit(); }} style={styles.saveButton} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileField({ control, name, label, placeholder, error, multiline, autoCapitalize }: {
  control: ReturnType<typeof useForm<ProfileFormValues>>['control'];
  name: keyof ProfileFormValues;
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => (
        <TextInput autoCapitalize={autoCapitalize ?? 'sentences'} placeholder={placeholder} placeholderTextColor={theme.colors.textMuted} value={String(value ?? '')} onChangeText={onChange} onBlur={onBlur} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]} />
      )} />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  avatarBlock: { alignItems: 'center', marginBottom: theme.spacing.xl },
  avatar: { width: 104, height: 104, borderRadius: 52 },
  avatarFallback: { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: theme.colors.primarySoft, fontSize: 38, fontWeight: '800' },
  photoButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: -22, marginLeft: 76, borderColor: theme.colors.background, borderWidth: 3, ...theme.shadows.button },
  avatarHint: { color: theme.colors.textSecondary, fontSize: 12, marginTop: theme.spacing.sm },
  bannerError: { color: theme.colors.danger, fontSize: 14, lineHeight: 20, marginBottom: theme.spacing.md },
  successMessage: { color: theme.colors.success, fontSize: 14, lineHeight: 20, marginBottom: theme.spacing.md },
  field: { marginBottom: theme.spacing.md },
  label: { color: theme.colors.text, fontSize: 14, fontWeight: '600', marginBottom: theme.spacing.sm },
  input: { minHeight: 50, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, color: theme.colors.text, fontSize: 15 },
  multilineInput: { minHeight: 120, paddingTop: theme.spacing.md },
  inputError: { borderColor: theme.colors.danger },
  fieldError: { color: theme.colors.danger, fontSize: 12, marginTop: theme.spacing.xs },
  counter: { color: theme.colors.textMuted, fontSize: 12, marginTop: -theme.spacing.xs, marginBottom: theme.spacing.md },
  saveButton: { marginTop: theme.spacing.md },
});
