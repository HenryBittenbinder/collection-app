import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSendMessage } from '@/src/features/chat/api/chatHooks';
import { messageSchema, type MessageFormValues } from '@/src/features/chat/schemas/messageSchema';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function MessageComposer({ conversationId, onSent }: { conversationId: number; onSent: () => void }) {
  const sendMutation = useSendMessage(conversationId);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<MessageFormValues>({ resolver: zodResolver(messageSchema), defaultValues: { body: '' } });

  const submit = async (values: MessageFormValues) => {
    try {
      await sendMutation.mutateAsync(values.body);
      reset({ body: '' });
      onSent();
    } catch {
      // O erro da API é exibido abaixo do campo.
    }
  };

  return (
    <View style={styles.container}>
      <Controller control={control} name="body" render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.field}>
          <TextInput value={value} onChangeText={onChange} onBlur={onBlur} multiline maxLength={1000} placeholder="Escreva uma mensagem..." placeholderTextColor={theme.colors.textMuted} style={[styles.input, errors.body && styles.inputError]} />
          {errors.body ? <Text style={styles.error}>{errors.body.message}</Text> : null}
          {sendMutation.isError ? <Text style={styles.error}>{getApiError(sendMutation.error).fieldErrors.body ?? getApiError(sendMutation.error).message}</Text> : null}
        </View>
      )} />
      <Pressable accessibilityRole="button" accessibilityLabel="Enviar mensagem" disabled={sendMutation.isPending} onPress={() => { void handleSubmit(submit)(); }} style={styles.sendButton}>
        {sendMutation.isPending ? <ActivityIndicator color="#081018" /> : <Ionicons name="send" size={19} color="#081018" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: theme.colors.border },
  field: { flex: 1 },
  input: { minHeight: 46, maxHeight: 112, color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, textAlignVertical: 'center' },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: 11, marginTop: theme.spacing.xs },
  sendButton: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.radius.md },
});
