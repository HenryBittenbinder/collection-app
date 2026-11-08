import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { itemSchema, type ItemFormData } from '@/src/features/items/schemas/itemSchema';
import theme from '@/src/shared/theme/theme';

const defaultValues: ItemFormData = {
  nome: '',
  categoria: '',
  marca: '',
  descricao: '',
  estadoConservacao: '',
  valorEstimado: 0,
  precoDesejado: 0,
  disponibilidade: 'exibicao',
  fotoUrl: '',
};

export default function ItemFormScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues,
  });

  const selectedImage = watch('fotoUrl');

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão', 'É necessário permitir o uso da câmera para continuar.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setValue('fotoUrl', result.assets[0].uri, { shouldValidate: true });
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão', 'É necessário permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setValue('fotoUrl', result.assets[0].uri, { shouldValidate: true });
    }
  };

  const onSubmit = (data: ItemFormData) => {
    Alert.alert('Sucesso', `Item pronto para validação: ${data.nome}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Adicionar item</Text>

      <View style={styles.imageRow}>
        <Pressable onPress={pickFromCamera} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Tirar foto</Text>
        </Pressable>
        <Pressable onPress={pickFromGallery} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Escolher da galeria</Text>
        </Pressable>
      </View>

      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <Field label="Nome" error={errors.nome?.message}>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Nome do item"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          )}
        />
      </Field>

      <Field label="Categoria" error={errors.categoria?.message}>
        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ex.: Figuras"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          )}
        />
      </Field>

      <Field label="Marca" error={errors.marca?.message}>
        <Controller
          control={control}
          name="marca"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Marca"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          )}
        />
      </Field>

      <Field label="Descrição" error={errors.descricao?.message}>
        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Descreva o item"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, styles.textArea]}
              multiline
            />
          )}
        />
      </Field>

      <Field label="Estado de conservação" error={errors.estadoConservacao?.message}>
        <Controller
          control={control}
          name="estadoConservacao"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Excelente, Boa, etc."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          )}
        />
      </Field>

      <View style={styles.twoColumns}>
        <Field label="Valor estimado" error={errors.valorEstimado?.message} width="48%">
          <Controller
            control={control}
            name="valorEstimado"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={String(value ?? '')}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.input}
              />
            )}
          />
        </Field>

        <Field label="Preço desejado" error={errors.precoDesejado?.message} width="48%">
          <Controller
            control={control}
            name="precoDesejado"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={String(value ?? '')}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.input}
              />
            )}
          />
        </Field>
      </View>

      <Field label="Disponibilidade" error={errors.disponibilidade?.message}>
        <Controller
          control={control}
          name="disponibilidade"
          render={({ field: { onChange, value } }) => (
            <View style={styles.optionRow}>
              {['exibicao', 'venda', 'troca'].map((option) => {
                const active = value === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.optionButton, active && styles.optionButtonActive]}
                    onPress={() => onChange(option)}
                  >
                    <Text style={[styles.optionButtonText, active && styles.optionButtonTextActive]}>
                      {option === 'exibicao' ? 'Exibição' : option === 'venda' ? 'Venda' : 'Troca'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </Field>

      <Pressable
        onPress={() => {
          void handleSubmit(onSubmit as any)();
        }}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>Validar item</Text>
      </Pressable>
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
  width?: string;
};

function Field({ label, error, children, width }: FieldProps) {
  return (
    <View style={[styles.field, width ? { width } : null]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  imageRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#081018',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  twoColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  optionButtonTextActive: {
    color: '#081018',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    color: '#081018',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
});
