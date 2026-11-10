import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Controller, useForm, type FieldErrors, type FieldPath } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useCreateItem, useItem, useUpdateItem } from '@/src/features/items/api/itemsHooks';
import { itemSchema, type ItemFormValues } from '@/src/features/items/schemas/itemSchema';
import CurrencyInput from '@/src/shared/components/CurrencyInput';
import FeedbackModal from '@/src/shared/components/FeedbackModal';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

const defaultValues: ItemFormValues = {
  name: '',
  category: '',
  brand: '',
  description: '',
  condition: 'novo',
  estimated_value: '',
  asking_price: '',
  availability: 'exibicao',
  photo: undefined,
};

const fieldOrder: Array<FieldPath<ItemFormValues>> = [
  'photo', 'name', 'category', 'brand', 'description', 'condition',
  'estimated_value', 'asking_price', 'availability',
];

const conditionOptions: Array<{ value: ItemFormValues['condition']; label: string }> = [
  { value: 'novo', label: 'Novo' },
  { value: 'excelente', label: 'Excelente' },
  { value: 'bom', label: 'Bom' },
  { value: 'regular', label: 'Regular' },
];

const availabilityOptions: Array<{ value: ItemFormValues['availability']; label: string }> = [
  { value: 'exibicao', label: 'Exibição' },
  { value: 'venda', label: 'Venda' },
  { value: 'troca', label: 'Troca' },
];

export default function ItemFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; from?: string | string[] }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const editId = Number(routeId);
  const isEditMode = Boolean(routeId) && Number.isInteger(editId) && editId > 0;
  const itemQuery = useItem(isEditMode ? editId : Number.NaN);
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const isPending = createItem.isPending || updateItem.isPending;
  const scrollRef = useRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void } | null>(null);
  const fieldPositions = useRef<Record<string, number>>({});
  const initializedItemId = useRef<number | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues,
  });

  const selectedPhoto = watch('photo');

  useEffect(() => {
    const item = itemQuery.data;
    if (!isEditMode || !item || initializedItemId.current === item.id) return;

    reset({
      name: item.name,
      category: item.category,
      brand: item.brand ?? '',
      description: item.description ?? '',
      condition: item.condition,
      estimated_value: item.estimated_value ?? '',
      asking_price: item.asking_price ?? '',
      availability: item.availability,
      photo: undefined,
    });
    initializedItemId.current = item.id;
  }, [isEditMode, itemQuery.data, reset]);

  const scrollToField = (field: string) => {
    const y = fieldPositions.current[field];
    if (y !== undefined) setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(y - theme.spacing.lg, 0), animated: true }), 250);
  };

  const storePhoto = (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.fileSize !== null && asset.fileSize !== undefined && asset.fileSize > 4 * 1024 * 1024) {
      setValue('photo', undefined, { shouldDirty: true });
      setError('photo', {
        type: 'validate',
        message: 'A foto deve ter até 4 MB. Escolha uma imagem menor.',
      });
      return;
    }

    setValue('photo', {
      uri: asset.uri,
      fileName: asset.fileName?.trim() || 'foto.jpg',
      mimeType: asset.mimeType?.trim() || 'image/jpeg',
    }, { shouldDirty: true, shouldValidate: true });
    clearErrors('photo');
    setBannerError(null);
  };

  const pickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setBannerError('Permita o acesso à câmera nas configurações do celular para tirar uma foto.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled && result.assets[0]) storePhoto(result.assets[0]);
    } catch {
      setBannerError('Não foi possível abrir a câmera. Tente novamente ou escolha uma foto da galeria.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setBannerError('Permita o acesso às fotos nas configurações do celular para escolher uma imagem.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
      if (!result.canceled && result.assets[0]) storePhoto(result.assets[0]);
    } catch {
      setBannerError('Não foi possível abrir a galeria. Tente novamente ou tire uma foto com a câmera.');
    }
  };

  const onSubmit = async (values: ItemFormValues) => {
    setBannerError(null);
    try {
      if (isEditMode) {
        await updateItem.mutateAsync({ id: editId, values });
      } else {
        await createItem.mutateAsync(values);
        reset(defaultValues);
      }
      setSuccessVisible(true);
    } catch (error) {
      const apiError = getApiError(error);
      const entries = Object.entries(apiError.fieldErrors);
      let firstField: string | undefined;

      for (const [field, message] of entries) {
        if (fieldOrder.includes(field as FieldPath<ItemFormValues>)) {
          setError(field as FieldPath<ItemFormValues>, { type: 'server', message });
          firstField ??= field;
        }
      }

      if (firstField) scrollToField(firstField);
      if (!firstField) setBannerError(apiError.message);
    }
  };

  const onInvalid = (formErrors: FieldErrors<ItemFormValues>) => {
    const errorNames = Object.keys(formErrors);
    const firstField = fieldOrder.find((field) => errorNames.includes(field));
    if (firstField) scrollToField(firstField);
  };

  const finishSuccess = () => {
    setSuccessVisible(false);
    if (isEditMode) {
      router.replace({ pathname: '/item/[id]', params: { id: String(editId), from: 'profile' } });
    } else {
      router.replace('/(tabs)');
    }
  };

  if (isEditMode && itemQuery.isLoading) return <LoadingState message="Carregando item para edição..." />;
  if (isEditMode && (itemQuery.isError || !itemQuery.data)) {
    return <ErrorState message={getApiError(itemQuery.error).message} onRetry={() => { void itemQuery.refetch(); }} />;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView ref={(instance) => { scrollRef.current = instance; }} style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isEditMode ? 'Editar item' : 'Adicionar item'}</Text>

        {bannerError ? (
          <View accessibilityRole="alert" style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
            <Text style={styles.errorBannerText}>{bannerError}</Text>
          </View>
        ) : null}

        <Field label="Foto (opcional)" error={errors.photo?.message} onLayout={(y) => { fieldPositions.current.photo = y; }}>
          <View style={styles.imageRow}>
            <Pressable onPress={pickFromCamera} style={styles.primaryButton} disabled={isPending}>
              <Text style={styles.primaryButtonText}>Tirar foto</Text>
            </Pressable>
            <Pressable onPress={pickFromGallery} style={styles.secondaryButton} disabled={isPending}>
              <Text style={styles.secondaryButtonText}>Escolher da galeria</Text>
            </Pressable>
          </View>
          {selectedPhoto?.uri || itemQuery.data?.photo ? <Image source={{ uri: selectedPhoto?.uri ?? itemQuery.data?.photo ?? undefined }} style={styles.preview} resizeMode="cover" /> : null}
        </Field>

        <Field label="Nome" error={errors.name?.message} onLayout={(y) => { fieldPositions.current.name = y; }}>
          <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput value={value} onChangeText={onChange} onBlur={onBlur} onFocus={() => scrollToField('name')} placeholder="Nome do item" placeholderTextColor={theme.colors.textMuted} style={styles.input} editable={!isPending} />
          )} />
        </Field>

        <Field label="Categoria" error={errors.category?.message} onLayout={(y) => { fieldPositions.current.category = y; }}>
          <Controller control={control} name="category" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput value={value} onChangeText={onChange} onBlur={onBlur} onFocus={() => scrollToField('category')} placeholder="Ex.: Figuras" placeholderTextColor={theme.colors.textMuted} style={styles.input} editable={!isPending} />
          )} />
        </Field>

        <Field label="Marca (opcional)" error={errors.brand?.message} onLayout={(y) => { fieldPositions.current.brand = y; }}>
          <Controller control={control} name="brand" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput value={value ?? ''} onChangeText={onChange} onBlur={onBlur} onFocus={() => scrollToField('brand')} placeholder="Marca" placeholderTextColor={theme.colors.textMuted} style={styles.input} editable={!isPending} />
          )} />
        </Field>

        <Field label="Descrição (opcional)" error={errors.description?.message} onLayout={(y) => { fieldPositions.current.description = y; }}>
          <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput value={value ?? ''} onChangeText={onChange} onBlur={onBlur} onFocus={() => scrollToField('description')} placeholder="Descreva o item" placeholderTextColor={theme.colors.textMuted} style={[styles.input, styles.textArea]} multiline editable={!isPending} />
          )} />
        </Field>

        <Field label="Condição" error={errors.condition?.message} onLayout={(y) => { fieldPositions.current.condition = y; }}>
          <Controller control={control} name="condition" render={({ field: { onChange, value } }) => (
            <View style={styles.optionRow}>
              {conditionOptions.map((option) => <OptionButton key={option.value} label={option.label} active={value === option.value} disabled={isPending} onPress={() => onChange(option.value)} />)}
            </View>
          )} />
        </Field>

        <View style={styles.twoColumns} onLayout={(event) => { fieldPositions.current.moneyRow = event.nativeEvent.layout.y; }}>
          <Field label="Valor estimado (opcional)" error={errors.estimated_value?.message} width="48%" onLayout={(y) => { fieldPositions.current.estimated_value = (fieldPositions.current.moneyRow ?? 0) + y; }}>
            <Controller control={control} name="estimated_value" render={({ field: { onChange, value } }) => (
              <CurrencyInput value={value} onChangeValue={onChange} onFocus={() => scrollToField('estimated_value')} editable={!isPending} />
            )} />
          </Field>
          <Field label="Preço pedido (opcional)" error={errors.asking_price?.message} width="48%" onLayout={(y) => { fieldPositions.current.asking_price = (fieldPositions.current.moneyRow ?? 0) + y; }}>
            <Controller control={control} name="asking_price" render={({ field: { onChange, value } }) => (
              <CurrencyInput value={value} onChangeValue={onChange} onFocus={() => scrollToField('asking_price')} editable={!isPending} />
            )} />
          </Field>
        </View>

        <Field label="Disponibilidade" error={errors.availability?.message} onLayout={(y) => { fieldPositions.current.availability = y; }}>
          <Controller control={control} name="availability" render={({ field: { onChange, value } }) => (
            <View style={styles.optionRow}>
              {availabilityOptions.map((option) => <OptionButton key={option.value} label={option.label} active={value === option.value} disabled={isPending} onPress={() => onChange(option.value)} />)}
            </View>
          )} />
        </Field>

        <Pressable onPress={() => { void handleSubmit(onSubmit, onInvalid)(); }} style={[styles.submitButton, isPending && styles.submitButtonDisabled]} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#081018" /> : <Text style={styles.submitButtonText}>{isEditMode ? 'Salvar alterações' : 'Cadastrar item'}</Text>}
        </Pressable>
      </ScrollView>

      <FeedbackModal
        visible={successVisible}
        title={isEditMode ? 'Item atualizado!' : 'Item adicionado à sua coleção!'}
        message={isEditMode ? 'As alterações foram salvas.' : 'O item foi salvo com sucesso.'}
        actionLabel={isEditMode ? 'Voltar ao item' : 'Ir para Explorar'}
        onAction={finishSuccess}
      />
    </KeyboardAvoidingView>
  );
}

function OptionButton({ label, active, disabled, onPress }: { label: string; active: boolean; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active, disabled }} disabled={disabled} style={[styles.optionButton, active && styles.optionButtonActive]} onPress={onPress}>
      <Text style={[styles.optionButtonText, active && styles.optionButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

type FieldProps = { label: string; error?: string; children: ReactNode; width?: string; onLayout?: (y: number) => void };

function Field({ label, error, children, width, onLayout }: FieldProps) {
  return (
    <View onLayout={(event) => onLayout?.(event.nativeEvent.layout.y)} style={[styles.field, width ? { width } : null]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: theme.spacing.lg },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: '#351C22', borderColor: theme.colors.danger, borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.lg },
  errorBannerText: { flex: 1, color: '#FCA5A5', fontSize: 14, lineHeight: 20 },
  imageRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.md },
  primaryButton: { flex: 1, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  primaryButtonText: { color: '#081018', fontWeight: '700' },
  secondaryButton: { flex: 1, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  secondaryButtonText: { color: theme.colors.text, fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: theme.radius.lg, marginBottom: theme.spacing.lg, backgroundColor: theme.colors.surface },
  field: { marginBottom: theme.spacing.md },
  label: { color: theme.colors.text, fontSize: 14, fontWeight: '600', marginBottom: theme.spacing.xs },
  input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, color: theme.colors.text, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, fontSize: 15 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  twoColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm },
  optionButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  optionButtonText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  optionButtonTextActive: { color: '#081018' },
  submitButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginTop: theme.spacing.md, minHeight: 50, justifyContent: 'center' },
  submitButtonDisabled: { opacity: 0.65 },
  submitButtonText: { color: '#081018', fontWeight: '700', fontSize: 16 },
  errorText: { color: theme.colors.danger, fontSize: 12, marginTop: theme.spacing.xs },
});
