import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { mockActivity } from '@/src/features/activity/data/mockActivity';
import ConversationList from '@/src/features/chat/components/ConversationList';
import EmptyState from '@/src/shared/components/EmptyState';
import theme from '@/src/shared/theme/theme';

export default function ActivityScreen() {
  const [section, setSection] = useState<'activity' | 'chat'>('activity');

  return (
    <View style={styles.container}>
      <View style={styles.sectionButtons}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: section === 'activity' }} onPress={() => setSection('activity')} style={[styles.sectionButton, section === 'activity' && styles.sectionButtonActive]}>
          <Text style={styles.sectionButtonText}>Atividade</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: section === 'chat' }} onPress={() => setSection('chat')} style={[styles.sectionButton, section === 'chat' && styles.sectionButtonActive]}>
          <Text style={styles.sectionButtonText}>Chat</Text>
        </Pressable>
      </View>
      {section === 'activity' ? (
        <FlatList
          data={mockActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  <Text style={styles.user}>{item.user}</Text> {item.text}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.chatContent}>
          <ConversationList />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  sectionButtons: { flexDirection: 'row', gap: theme.spacing.md, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
  sectionButton: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceElevated, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md },
  sectionButtonActive: { borderWidth: 2 },
  sectionButtonText: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  chatContent: { flex: 1 },
  listContent: {
    padding: theme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  user: {
    fontWeight: '700',
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
});
