import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useCreateComment } from '@/src/features/comments/api/commentsHooks';
import { commentSchema, type CommentFormValues } from '@/src/features/comments/schemas/commentSchema';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

export default function CommentComposer({ itemId }: { itemId: number }) {
  const createMutation = useCreateComment(itemId);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CommentFormValues>({ resolver: zodResolver(commentSchema), defaultValues: { body: '' } });

  const submit = async (values: CommentFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      reset({ body: '' });
    } catch {
      // A mensagem da API aparece abaixo do campo.
    }
  };

  return (
    <View style={styles.container}>
      <Controller control={control} name="body" render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.field}>
          <TextInput value={value} onChangeText={onChange} onBlur={onBlur} multiline maxLength={500} placeholder="Escreva um comentário..." placeholderTextColor={theme.colors.textMuted} style={[styles.input, errors.body && styles.inputError]} />
          {errors.body ? <Text style={styles.error}>{errors.body.message}</Text> : null}
          {createMutation.isError ? <Text style={styles.error}>{getApiError(createMutation.error).fieldErrors.body ?? getApiError(createMutation.error).message}</Text> : null}
        </View>
      )} />
      <Button title="Enviar" loading={createMutation.isPending} onPress={() => { void handleSubmit(submit)(); }} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: theme.colors.border },
  field: { flex: 1 },
  input: { maxHeight: 112, minHeight: 46, color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, textAlignVertical: 'center' },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: 11, marginTop: theme.spacing.xs },
  button: { minWidth: 76, alignSelf: 'auto' },
});
