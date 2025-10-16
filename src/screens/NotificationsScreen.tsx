import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { ExtendedMessage, NotificationFilters } from '../types/notifications';
import { NotificationService } from '../services/NotificationService';
import { NotificationCard } from '../components/NotificationCard';
import { designTokens } from '../design-system/design-tokens';
import { componentStyles } from '../design-system/component-styles';
import { Logger } from '../services/Logger';

interface NotificationsScreenProps {
  onClose: () => void;
  onNotificationPress?: (notification: ExtendedMessage) => void;
  onSettingsPress?: () => void;
  initialFilters?: NotificationFilters;
  title?: string;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onClose,
  onNotificationPress,
  onSettingsPress,
  initialFilters,
  title = 'Notifications',
}) => {
  const [notifications, setNotifications] = useState<ExtendedMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<NotificationFilters>(() => initialFilters || {});
  const hasLoadedInitially = useRef(false);
  const previousFiltersRef = useRef<string>('');

  // Load notifications when component mounts or filters actually change
  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);
    
    if (!hasLoadedInitially.current) {
      console.log('NotificationsScreen: Initial load');
      previousFiltersRef.current = currentFiltersString;
      loadNotifications(true).then(() => {
        console.log('Initial load completed, setting hasLoadedInitially to true');
        hasLoadedInitially.current = true;
      });
      loadUnreadCount();
    } else if (previousFiltersRef.current !== currentFiltersString) {
      console.log('NotificationsScreen: Filters actually changed, reloading:', filters);
      previousFiltersRef.current = currentFiltersString;
      loadNotifications(true);
    }
  }, [JSON.stringify(filters)]);

  const loadNotifications = async (reset: boolean = false) => {
    console.log('loadNotifications called with reset:', reset, 'loading:', loading);
    if (loading && !reset) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      console.log('Fetching notifications for page:', currentPage);
      const response = await NotificationService.fetchNotifications(
        filters,
        currentPage,
        20,
      );

      console.log('Received notifications:', response.notifications.length);
      if (reset) {
        console.log('Resetting notifications list');
        setNotifications(response.notifications);
        setPage(2);
      } else {
        console.log('Appending to existing notifications');
        setNotifications(prev => [...prev, ...response.notifications]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const onRefresh = useCallback(async () => {
    console.log('onRefresh: Refreshing notifications');
    setRefreshing(true);
    await loadNotifications(true);
    await loadUnreadCount();
    setRefreshing(false);
  }, []); // Remove filters dependency to prevent unnecessary recreations

  const handleNotificationPress = async (notification: ExtendedMessage) => {
    Logger.userAction('NotificationsScreen', 'notification_press', {
      notificationId: notification.id,
      notificationType: notification.type,
      wasRead: notification.isRead,
    });

    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await NotificationService.updateNotification(
          notification.id,
          'mark_read',
        );
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        Logger.error(
          'NotificationsScreen',
          'Error marking notification as read',
          err as Error,
          {
            notificationId: notification.id,
          },
        );
      }
    }

    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const handleNotificationLongPress = (notification: ExtendedMessage) => {
    Logger.userAction('NotificationsScreen', 'notification_long_press', {
      notificationId: notification.id,
      notificationType: notification.type,
    });

    Alert.alert(
      'Notification Actions',
      `What would you like to do with "${notification.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: notification.isRead ? 'Mark as Unread' : 'Mark as Read',
          onPress: () => toggleReadStatus(notification),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNotification(notification),
        },
      ],
    );
  };

  const toggleReadStatus = async (notification: ExtendedMessage) => {
    try {
      const action = notification.isRead ? 'mark_unread' : 'mark_read';
      await NotificationService.updateNotification(notification.id, action);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: !n.isRead } : n,
        ),
      );

      setUnreadCount(prev =>
        notification.isRead ? prev + 1 : Math.max(0, prev - 1),
      );
    } catch (err) {
      console.error('Error toggling read status:', err);
      Alert.alert('Error', 'Failed to update notification');
    }
  };

  const deleteNotification = async (notification: ExtendedMessage) => {
    try {
      await NotificationService.updateNotification(notification.id, 'delete');
      setNotifications(prev => prev.filter(n => n.id !== notification.id));

      if (!notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };




  const renderNotification = ({ item }: { item: ExtendedMessage }) => (
    <NotificationCard
      notification={item}
      onPress={handleNotificationPress}
      onLongPress={handleNotificationLongPress}
      showActions={false}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{title}</Text>
        {onSettingsPress ? (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading || notifications.length === 0) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptyDescription}>
        You don't have any notifications yet.
      </Text>
    </View>
  );

  if (error && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadNotifications(true)}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[designTokens.colors.primary[500]]}
            tintColor={designTokens.colors.primary[500]}
          />
        }
        onEndReached={() => {
          if (hasMore && !loading && hasLoadedInitially.current && notifications.length > 0) {
            console.log('onEndReached: Loading more notifications, current count:', notifications.length);
            loadNotifications();
          } else {
            console.log('onEndReached: Blocked - hasMore:', hasMore, 'loading:', loading, 'hasLoaded:', hasLoadedInitially.current, 'notificationCount:', notifications.length);
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyContentContainer : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[0],
  },
  header: {
    backgroundColor: designTokens.colors.neutral[0],
    paddingHorizontal: designTokens.spacing.md + 4, // 20px
    paddingTop: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.md + 4, // 20px
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.neutral[200],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: designTokens.spacing.xl, // 32px
    height: designTokens.spacing.xl, // 32px
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: designTokens.typography.sizes['2xl'],
    color: designTokens.colors.neutral[1000],
    fontWeight: designTokens.typography.weights.normal,
  },
  screenTitle: {
    ...componentStyles.text.variants.h5, // lg size with medium weight
    color: designTokens.colors.neutral[1000],
    flex: 1,
    textAlign: 'center',
    marginHorizontal: designTokens.spacing.md,
  },
  headerSpacer: {
    width: designTokens.spacing.xl, // 32px
  },
  settingsButton: {
    width: designTokens.spacing.xl, // 32px
    height: designTokens.spacing.xl, // 32px
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.neutral[100],
    borderRadius: designTokens.borderRadius.full,
  },
  settingsIcon: {
    fontSize: 16,
    color: designTokens.colors.neutral[600],
  },
  footer: {
    padding: designTokens.spacing.md + 4, // 20px
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl, // 32px
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyIcon: {
    fontSize: designTokens.typography.sizes['5xl'], // 48px
    marginBottom: designTokens.spacing.md,
  },
  emptyTitle: {
    ...componentStyles.text.variants.h5, // lg size with medium weight
    color: designTokens.colors.neutral[700],
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...componentStyles.text.variants.body1,
    color: designTokens.colors.neutral[500],
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl, // 32px
  },
  errorIcon: {
    fontSize: designTokens.typography.sizes['5xl'], // 48px
    marginBottom: designTokens.spacing.md,
  },
  errorTitle: {
    ...componentStyles.text.variants.h5, // lg size with medium weight
    color: designTokens.colors.neutral[700],
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  errorDescription: {
    ...componentStyles.text.variants.body1,
    color: designTokens.colors.neutral[500],
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  retryButton: {
    ...componentStyles.button.base,
    ...componentStyles.button.variants.primary,
    ...componentStyles.button.sizes.medium,
  },
  retryButtonText: {
    ...componentStyles.text.variants.buttonMedium,
    color: componentStyles.button.variants.primary.textColor,
  },
});

export default NotificationsScreen;
