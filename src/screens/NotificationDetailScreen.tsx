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

interface NotificationDetailScreenProps {
  notificationId?: string;
  notification?: ExtendedMessage;
  onBack?: () => void;
  onActionPress?: (actionUrl: string) => void;
  onNotificationUpdate?: (notification: ExtendedMessage) => void;
}

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  notificationId,
  notification: initialNotification,
  onBack,
  onActionPress,
  onNotificationUpdate,
}) => {
  const [notification, setNotification] = useState<ExtendedMessage | null>(initialNotification || null);
  const [loading, setLoading] = useState<boolean>(!initialNotification && !!notificationId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (notificationId && !initialNotification) {
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
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleReadStatus} style={styles.headerActionButton}>
            <Text style={styles.headerActionText}>
              {notification.isRead ? 'Mark Unread' : 'Mark Read'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteNotification} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status and Priority Indicators */}
        <View style={styles.indicatorsRow}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{notification.status.toUpperCase()}</Text>
          </View>
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
            <Text style={styles.priorityText}>{notification.priority.toUpperCase()}</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Type Icon and Category */}
          <View style={styles.typeRow}>
            <View style={styles.typeIconContainer}>
              <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
            </View>
            <Text style={styles.categoryText}>{notification.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{notification.title}</Text>

          {/* Profile Image */}
          {notification.imageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: notification.imageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>{notification.description}</Text>

          {/* Date */}
          <Text style={styles.dateText}>{formatDate(notification.date)}</Text>

          {/* Action Button */}
          {notification.actionText && notification.actionUrl && (
            <TouchableOpacity onPress={handleActionPress} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{notification.actionText}</Text>
            </TouchableOpacity>
          )}

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataTitle}>Additional Information</Text>
              {Object.entries(notification.metadata).map(([key, value]) => (
                <View key={key} style={styles.metadataRow}>
                  <Text style={styles.metadataKey}>{key}:</Text>
                  <Text style={styles.metadataValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  headerActionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  indicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  mainContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    lineHeight: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#F0F0F0',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  metadataContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 20,
  },
  metadataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataKey: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    minWidth: 100,
  },
  metadataValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationDetailScreen;
