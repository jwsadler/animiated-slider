import React, { useState, useEffect, useCallback } from 'react';
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
  onNotificationPress?: (notification: ExtendedMessage) => void;
  onSettingsPress?: () => void;
  initialFilters?: NotificationFilters;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onNotificationPress,
  onSettingsPress,
  initialFilters,
}) => {
  const [notifications, setNotifications] = useState<ExtendedMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters || {});
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications(true);
    loadUnreadCount();
  }, [filters]);

  const loadNotifications = async (reset: boolean = false) => {
    if (loading && !reset) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const response = await NotificationService.fetchNotifications(
        filters,
        currentPage,
        20
      );

      if (reset) {
        setNotifications(response.notifications);
        setPage(2);
      } else {
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
    setRefreshing(true);
    await loadNotifications(true);
    await loadUnreadCount();
    setRefreshing(false);
  }, [filters]);

  const handleNotificationPress = async (notification: ExtendedMessage) => {
    Logger.userAction('NotificationsScreen', 'notification_press', {
      notificationId: notification.id,
      notificationType: notification.type,
      wasRead: notification.isRead
    });

    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await NotificationService.updateNotification(notification.id, 'mark_read');
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        Logger.error('NotificationsScreen', 'Error marking notification as read', err as Error, {
          notificationId: notification.id
        });
      }
    }

    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const handleNotificationLongPress = (notification: ExtendedMessage) => {
    Logger.userAction('NotificationsScreen', 'notification_long_press', {
      notificationId: notification.id,
      notificationType: notification.type
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
      ]
    );
  };

  const toggleReadStatus = async (notification: ExtendedMessage) => {
    try {
      const action = notification.isRead ? 'mark_unread' : 'mark_read';
      await NotificationService.updateNotification(notification.id, action);
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: !n.isRead } : n
        )
      );

      setUnreadCount(prev => 
        notification.isRead ? prev + 1 : Math.max(0, prev - 1)
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

  const handleFilterChange = (filter: 'all' | 'unread' | 'read') => {
    Logger.userAction('NotificationsScreen', 'filter_change', {
      previousFilter: selectedFilter,
      newFilter: filter,
      notificationCount: notifications.length
    });

    setSelectedFilter(filter);
    
    const newFilters: NotificationFilters = { ...initialFilters };
    
    if (filter === 'unread') {
      newFilters.isRead = false;
    } else if (filter === 'read') {
      newFilters.isRead = true;
    } else {
      delete newFilters.isRead;
    }
    
    setFilters(newFilters);
  };

  const markAllAsRead = async () => {
    Logger.userAction('NotificationsScreen', 'mark_all_as_read', {
      unreadCount
    });

    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      Logger.error('NotificationsScreen', 'Error marking all as read', err as Error, {
        unreadCount
      });
      Alert.alert('Error', 'Failed to mark all notifications as read');
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
        <Text style={styles.screenTitle}>Notifications</Text>
        {onSettingsPress && (
          <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {unreadCount > 0 && (
        <View style={styles.unreadRow}>
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllButtonText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        {(['all', 'unread', 'read'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.activeFilterButtonText,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
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
        {selectedFilter === 'unread' 
          ? "You're all caught up! No unread notifications."
          : selectedFilter === 'read'
          ? "No read notifications found."
          : "You don't have any notifications yet."}
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
          <TouchableOpacity onPress={() => loadNotifications(true)} style={styles.retryButton}>
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
        keyExtractor={(item) => item.id}
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
          if (hasMore && !loading) {
            loadNotifications();
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContentContainer : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[50],
  },
  header: {
    backgroundColor: designTokens.colors.neutral[0],
    paddingHorizontal: designTokens.spacing.md,
    paddingTop: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.sm + 4,
    ...designTokens.borders.sm,
    borderBottomColor: designTokens.colors.neutral[200],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm + 4,
  },
  screenTitle: {
    ...componentStyles.text.variants.h1,
    color: designTokens.colors.neutral[900],
  },
  settingsButton: {
    padding: designTokens.spacing.xs,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  unreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xs,
  },
  unreadText: {
    ...componentStyles.text.variants.body2,
    color: designTokens.colors.neutral[500],
  },
  markAllButton: {
    ...componentStyles.button.base,
    ...componentStyles.button.variants.primary,
    ...componentStyles.button.sizes.small,
  },
  markAllButtonText: {
    ...componentStyles.text.variants.buttonSmall,
    color: componentStyles.button.variants.primary.textColor,
  },
  filterRow: {
    flexDirection: 'row',
    gap: designTokens.spacing.xs,
  },
  filterButton: {
    ...componentStyles.button.base,
    ...componentStyles.button.variants.secondary,
    ...componentStyles.button.sizes.small,
  },
  activeFilterButton: {
    ...componentStyles.button.variants.primary,
  },
  filterButtonText: {
    ...componentStyles.text.variants.buttonSmall,
    color: componentStyles.button.variants.secondary.textColor,
  },
  activeFilterButtonText: {
    color: componentStyles.button.variants.primary.textColor,
  },
  footer: {
    padding: designTokens.spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: designTokens.spacing.md,
  },
  emptyTitle: {
    ...componentStyles.text.variants.h3,
    color: designTokens.colors.neutral[700],
    marginBottom: designTokens.spacing.xs,
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
    paddingHorizontal: designTokens.spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: designTokens.spacing.md,
  },
  errorTitle: {
    ...componentStyles.text.variants.h3,
    color: designTokens.colors.neutral[700],
    marginBottom: designTokens.spacing.xs,
    textAlign: 'center',
  },
  errorDescription: {
    ...componentStyles.text.variants.body1,
    color: designTokens.colors.neutral[500],
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg + 8,
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
