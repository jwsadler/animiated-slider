import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ExtendedMessage } from '../types/notifications';
import { NotificationService } from '../services/NotificationService';
import { designTokens } from '../design-system/design-tokens';
import { componentStyles } from '../design-system/component-styles';

interface NotificationDetailScreenProps {
  notificationId?: string;
  notification?: ExtendedMessage;
  onBack?: () => void;
  onActionPress?: (actionUrl: string) => void;
  onNotificationUpdate?: (notification: ExtendedMessage) => void;
  onSettingsPress?: () => void;
}

// Simple settings icon component
const SettingsIcon = () => (
  <View style={styles.settingsIcon}>
    <View style={styles.settingsIconDot} />
    <View style={styles.settingsIconDot} />
    <View style={styles.settingsIconDot} />
    <View style={styles.settingsIconDot} />
    <View style={styles.settingsIconDot} />
    <View style={styles.settingsIconDot} />
  </View>
);

// Mock notification data based on Figma design
const MOCK_NOTIFICATION: ExtendedMessage = {
  id: 'stream-moderator-invite',
  title: 'Stream moderator invite',
  description: 'Robert Pladius has invited you to the show Best Prices on NIKE / Adidas / Puma / Asics as an administrator and granted you the corresponding access permissions.',
  date: new Date(),
  status: 'new',
  type: 'referrals',
  category: 'Stream Invitation',
  priority: 'medium',
  isRead: false,
  actionText: 'Join Now',
  actionUrl: 'https://example.com/join-stream',
  imageUrl: 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=RP',
  metadata: {
    startTime: '12:50 AM',
    showName: 'Best Prices on NIKE / Adidas / Puma / Asics',
    inviterName: 'Robert Pladius',
    role: 'administrator'
  }
};

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  notificationId,
  notification: initialNotification,
  onBack,
  onActionPress,
  onNotificationUpdate,
  onSettingsPress,
}) => {
  // Use mock data for design demonstration, fallback to props
  const [notification, setNotification] = useState<ExtendedMessage | null>(
    initialNotification || MOCK_NOTIFICATION
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, always use mock data unless specific notification provided
    if (!initialNotification && !notificationId) {
      setNotification(MOCK_NOTIFICATION);
    } else if (notificationId && !initialNotification) {
      loadNotification();
    } else if (initialNotification && !initialNotification.isRead) {
      // Mark as read when viewing detail
      markAsRead(initialNotification);
    }
  }, [notificationId, initialNotification]);

  const loadNotification = async () => {
    if (!notificationId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedNotification = await NotificationService.getNotification(notificationId);
      if (fetchedNotification) {
        setNotification(fetchedNotification);
        if (!fetchedNotification.isRead) {
          markAsRead(fetchedNotification);
        }
      } else {
        setError('Notification not found');
      }
    } catch (err) {
      setError('Failed to load notification');
      console.error('Error loading notification:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationToUpdate: ExtendedMessage) => {
    try {
      await NotificationService.updateNotification(notificationToUpdate.id, 'mark_read');
      const updatedNotification = { ...notificationToUpdate, isRead: true };
      setNotification(updatedNotification);
      if (onNotificationUpdate) {
        onNotificationUpdate(updatedNotification);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleReadStatus = async () => {
    if (!notification) return;

    try {
      const action = notification.isRead ? 'mark_unread' : 'mark_read';
      await NotificationService.updateNotification(notification.id, action);
      const updatedNotification = { ...notification, isRead: !notification.isRead };
      setNotification(updatedNotification);
      if (onNotificationUpdate) {
        onNotificationUpdate(updatedNotification);
      }
    } catch (err) {
      console.error('Error toggling read status:', err);
      Alert.alert('Error', 'Failed to update notification');
    }
  };

  const deleteNotification = async () => {
    if (!notification) return;

    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.updateNotification(notification.id, 'delete');
              if (onBack) {
                onBack();
              }
            } catch (err) {
              console.error('Error deleting notification:', err);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const handleActionPress = () => {
    if (notification?.actionUrl && onActionPress) {
      onActionPress(notification.actionUrl);
    }
  };

  const getStatusColor = () => {
    if (!notification) return '#8E8E93';
    
    switch (notification.status) {
      case 'new':
        return '#007AFF';
      case 'downloaded':
        return '#34C759';
      case 'red':
        return '#FF3B30';
      case 'deleted':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getPriorityColor = () => {
    if (!notification) return '#8E8E93';
    
    switch (notification.priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getTypeIcon = () => {
    if (!notification) return '📱';
    
    switch (notification.type) {
      case 'new_follower':
        return '👤';
      case 'delivery':
        return '📦';
      case 'recommendations':
        return '💡';
      case 'referrals':
        return '🎁';
      case 'rewards':
        return '⭐';
      case 'account':
        return '🔒';
      default:
        return '📱';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading notification...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !notification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDescription}>
            {error || 'Notification not found'}
          </Text>
          <TouchableOpacity onPress={loadNotification} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Notifications</Text>
        {onSettingsPress && (
          <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
            <SettingsIcon />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Card */}
        <View style={styles.notificationCard}>
          <View style={styles.cardContent}>
            {/* Avatar and Content */}
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                {notification.imageUrl ? (
                  <Image
                    source={{ uri: notification.imageUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {notification.metadata?.inviterName?.charAt(0) || 'R'}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
              </View>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
              {notification.actionText && (
                <TouchableOpacity onPress={handleActionPress} style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>{notification.actionText}</Text>
                </TouchableOpacity>
              )}
              
              {notification.metadata?.startTime && (
                <Text style={styles.timeText}>
                  Starts at {notification.metadata.startTime}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.neutral[0],
  },
  backButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingRight: designTokens.spacing.sm,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: designTokens.colors.neutral[900],
    fontWeight: designTokens.typography.weights.normal,
  },
  headerTitle: {
    ...componentStyles.text.variants.h5,
    color: componentStyles.text.colors.primary,
    textAlign: 'center',
  },
  settingsButton: {
    padding: designTokens.spacing.sm,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  settingsIconDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: designTokens.colors.neutral[600],
    margin: 1,
  },
  content: {
    flex: 1,
    paddingTop: designTokens.spacing.md,
  },
  notificationCard: {
    backgroundColor: designTokens.colors.neutral[200],
    marginHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.shadows.sm,
  },
  cardContent: {
    padding: designTokens.spacing.md + 4, // 20px to match design
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: designTokens.spacing.md,
  },
  avatarContainer: {
    marginRight: designTokens.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: designTokens.colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...componentStyles.text.variants.h4,
    color: componentStyles.text.colors.secondary,
    fontWeight: designTokens.typography.weights.semibold,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    ...componentStyles.text.variants.body1,
    color: componentStyles.text.colors.primary,
    fontWeight: designTokens.typography.weights.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  notificationDescription: {
    ...componentStyles.text.variants.body2,
    color: componentStyles.text.colors.secondary,
    lineHeight: designTokens.typography.sizes.sm * 1.4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: designTokens.spacing.sm,
  },
  joinButton: {
    backgroundColor: designTokens.colors.neutral[900],
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm + 2, // 10px
    borderRadius: designTokens.borderRadius.full,
    ...designTokens.shadows.sm,
  },
  joinButtonText: {
    ...componentStyles.text.variants.buttonSmall,
    color: designTokens.colors.neutral[0],
    fontWeight: designTokens.typography.weights.semibold,
  },
  timeText: {
    ...componentStyles.text.variants.body2,
    color: componentStyles.text.colors.secondary,
    fontWeight: designTokens.typography.weights.normal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...componentStyles.text.variants.body1,
    color: componentStyles.text.colors.tertiary,
    marginTop: designTokens.spacing.sm,
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
    ...componentStyles.text.variants.h4,
    color: componentStyles.text.colors.primary,
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  errorDescription: {
    ...componentStyles.text.variants.body1,
    color: componentStyles.text.colors.tertiary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  retryButton: {
    backgroundColor: designTokens.colors.primary[500],
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
  },
  retryButtonText: {
    ...componentStyles.text.variants.button,
    color: designTokens.colors.neutral[0],
  },
});

export default NotificationDetailScreen;
