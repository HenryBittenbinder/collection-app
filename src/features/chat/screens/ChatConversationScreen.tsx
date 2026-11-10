import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConversations, useMessages } from '@/src/features/chat/api/chatHooks';
import MessageBubble from '@/src/features/chat/components/MessageBubble';
import MessageComposer from '@/src/features/chat/components/MessageComposer';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import BackButton from '@/src/shared/components/BackButton';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function ChatConversationScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const conversationId = Number(rawId);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const conversationsQuery = useConversations();
  const messagesQuery = useMessages(conversationId);
  const conversation = conversationsQuery.data?.find((entry) => entry.id === conversationId);
  const messages = messagesQuery.data ?? [];

  const scrollToLatest = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages.length, scrollToLatest]);

  if (conversationsQuery.isLoading && !conversationsQuery.data) return <LoadingState message="Carregando conversa..." />;
  if (conversationsQuery.isError && !conversationsQuery.data) {
    return <ErrorState message={getApiError(conversationsQuery.error).message} onRetry={() => { void conversationsQuery.refetch(); }} />;
  }
  if (!conversation) return <EmptyState message="Conversa não encontrada." />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <BackButton />
        {conversation.other_user.avatar ? <Image source={{ uri: conversation.other_user.avatar }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.initial}>{conversation.other_user.name.charAt(0).toUpperCase()}</Text></View>}
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{conversation.other_user.name}</Text>
          <Text style={styles.username} numberOfLines={1}>@{conversation.other_user.username}</Text>
        </View>
      </View>

      {conversation.item ? (
        <View style={styles.itemBar}>
          {conversation.item.photo ? <Image source={{ uri: conversation.item.photo }} style={styles.itemPhoto} /> : <View style={[styles.itemPhoto, styles.itemPlaceholder]}><Ionicons name="image-outline" size={17} color={theme.colors.textMuted} /></View>}
          <Text style={styles.itemName} numberOfLines={1}>{conversation.item.name}</Text>
        </View>
      ) : null}

      <ScrollView
        ref={scrollRef}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToLatest}
      >
        {messagesQuery.isLoading && !messagesQuery.data ? <LoadingState message="Carregando mensagens..." /> : null}
        {messagesQuery.isError && !messagesQuery.data ? <ErrorState message={getApiError(messagesQuery.error).message} onRetry={() => { void messagesQuery.refetch(); }} /> : null}
        {messages.length === 0 && !messagesQuery.isLoading && !messagesQuery.isError ? <Text style={styles.emptyMessages}>Inicie a conversa enviando uma mensagem.</Text> : null}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
      </ScrollView>
      <MessageComposer conversationId={conversationId} onSent={scrollToLatest} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: theme.spacing.sm },
  avatarFallback: { backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  initial: { color: theme.colors.text, fontSize: 17, fontWeight: '700' },
  headerText: { flex: 1 },
  name: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  username: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  itemBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.surfaceAlt },
  itemPhoto: { width: 34, height: 34, borderRadius: theme.radius.sm, marginRight: theme.spacing.sm },
  itemPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  itemName: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600', flex: 1 },
  messagesScroll: { flex: 1 },
  messagesContent: { padding: theme.spacing.md, paddingBottom: theme.spacing.lg, flexGrow: 1, justifyContent: 'flex-end' },
  emptyMessages: { color: theme.colors.textMuted, textAlign: 'center', marginVertical: theme.spacing.xl },
});
