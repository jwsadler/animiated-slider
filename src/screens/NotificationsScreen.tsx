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
import { NotificationService } from '../services/NotificationService.firebase';
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
  const notificationService = useRef(NotificationService.getInstance());

  // Initialize Firebase service and set up real-time listeners
  useEffect(() => {
    const initializeService = async () => {
      try {
        // Initialize with a demo user ID - replace with actual user ID from your auth system
        const userId = 'F3D2dgimI5ZJIKQ09gjIjKqW6F33';
        
        if (!notificationService.current.isInitialized()) {
          await notificationService.current.initialize(userId);
        }

        // Set up real-time listeners
        notificationService.current.setupRealtimeListeners({
          onNotificationsUpdated: (updatedNotifications) => {
            console.log('Real-time notifications update:', updatedNotifications.length);
            setNotifications(updatedNotifications);
            setError(null);
          },
          onUnreadCountChanged: (count) => {
            console.log('Unread count changed:', count);
            setUnreadCount(count);
          },
          onError: (err) => {
            console.error('Firebase notification error:', err);
            setError(err.message);
          }
        });

        console.log('Firebase notification service initialized');
      } catch (err) {
        console.error('Failed to initialize Firebase service:', err);
        setError('Failed to initialize notification service');
      }
    };

    initializeService();

    // Cleanup listeners on unmount
    return () => {
      notificationService.current.removeRealtimeListeners({
        onNotificationsUpdated: (updatedNotifications) => {
          setNotifications(updatedNotifications);
        },
        onUnreadCountChanged: (count) => {
          setUnreadCount(count);
        },
        onError: (err) => {
          setError(err.message);
        }
      });
    };
  }, []);

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
      
      // Use Firebase service
      const response = await notificationService.current.getNotifications(
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
      setUnreadCount(response.unreadCount);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.current.getUnreadCount();
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
        await notificationService.current.updateNotification(
          notification.id,
          'mark_read',
        );
        // Real-time listener will update the UI automatically
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
      await notificationService.current.updateNotification(notification.id, action);
      // Real-time listener will update the UI automatically
    } catch (err) {
      console.error('Error toggling read status:', err);
      Alert.alert('Error', 'Failed to update notification');
    }
  };

  const deleteNotification = async (notification: ExtendedMessage) => {
    try {
      await notificationService.current.updateNotification(notification.id, 'delete');
      // Real-time listener will update the UI automatically
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

  // Test function to create a notification
  const createTestNotification = async () => {
    try {
      const notificationId = await notificationService.current.createTestNotification();
      console.log('Test notification created:', notificationId);
      Alert.alert('Success', 'Test notification created!');
    } catch (err) {
      console.error('Failed to create test notification:', err);
      Alert.alert('Error', 'Failed to create test notification');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{title}</Text>
        <View style={styles.headerActions}>
          {/* Test button for development */}
          <TouchableOpacity style={styles.testButton} onPress={createTestNotification}>
            <Text style={styles.testButtonText}>+</Text>
          </TouchableOpacity>
          {onSettingsPress && (
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  testButton: {
    width: designTokens.spacing.xl, // 32px
    height: designTokens.spacing.xl, // 32px
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primary[500],
    borderRadius: designTokens.borderRadius.full,
  },
  testButtonText: {
    fontSize: 18,
    color: designTokens.colors.neutral[0],
    fontWeight: designTokens.typography.weights.semibold,
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
