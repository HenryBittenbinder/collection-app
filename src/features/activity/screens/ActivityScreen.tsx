import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { mockActivity } from '@/src/features/activity/data/mockActivity';
import theme from '@/src/shared/theme/theme';

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
