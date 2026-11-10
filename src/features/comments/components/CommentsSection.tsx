import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import CommentRow from '@/src/features/comments/components/CommentRow';
import { useComments, useCreateComment } from '@/src/features/comments/api/commentsHooks';
import { commentSchema, type CommentFormValues } from '@/src/features/comments/schemas/commentSchema';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function CommentsSection({ itemId }: { itemId: number }) {
  const { data: comments = [], isLoading, isError, error, refetch } = useComments(itemId);
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
      <Text style={styles.title}>Comentários</Text>
      {isLoading ? <LoadingState message="Carregando comentários..." /> : isError ? <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} /> : comments.length === 0 ? <Text style={styles.empty}>Seja o primeiro a comentar.</Text> : comments.map((comment) => <CommentRow key={comment.id} comment={comment} />)}
      <Controller control={control} name="body" render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <TextInput value={value} onChangeText={onChange} onBlur={onBlur} multiline maxLength={500} placeholder="Escreva um comentário..." placeholderTextColor={theme.colors.textMuted} style={[styles.input, errors.body && styles.inputError]} />
          {errors.body ? <Text style={styles.error}>{errors.body.message}</Text> : null}
          {createMutation.isError ? <Text style={styles.error}>{getApiError(createMutation.error).fieldErrors.body ?? getApiError(createMutation.error).message}</Text> : null}
        </View>
      )} />
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => { void handleSubmit(submit)(); }} disabled={createMutation.isPending}>
        {createMutation.isPending ? <ActivityIndicator color="#081018" /> : <Text style={styles.buttonText}>Enviar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: theme.spacing.sm },
  empty: { color: theme.colors.textSecondary, paddingVertical: theme.spacing.md },
  input: { minHeight: 88, color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, textAlignVertical: 'top' },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: 12, marginTop: theme.spacing.xs },
  button: { alignSelf: 'flex-end', minWidth: 88, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, borderRadius: theme.radius.md, marginTop: theme.spacing.sm },
  buttonText: { color: '#081018', fontWeight: '700' },
});
