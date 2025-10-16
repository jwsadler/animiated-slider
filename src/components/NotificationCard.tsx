import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { ExtendedMessage } from '../types/notifications';

interface NotificationCardProps {
  notification: ExtendedMessage;
  onPress?: (notification: ExtendedMessage) => void;
  onLongPress?: (notification: ExtendedMessage) => void;
  showActions?: boolean;
  disabled?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onLongPress,
  showActions = false,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(notification);
    }
  };

  const handleLongPress = () => {
    if (!disabled && onLongPress) {
      onLongPress(notification);
    }
  };

  const getStatusColor = () => {
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
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard,
        disabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <View style={[styles.unreadIndicator, { backgroundColor: getStatusColor() }]} />
      )}

      {/* Priority indicator */}
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />

      <View style={styles.cardContent}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            {/* Type icon */}
            <View style={styles.typeIcon}>
              <Text style={styles.typeIconText}>{getTypeIcon()}</Text>
            </View>

            {/* Profile image or placeholder */}
            {notification.imageUrl ? (
              <Image
                source={{ uri: notification.imageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>{getTypeIcon()}</Text>
              </View>
            )}

            {/* Title and category */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, !notification.isRead && styles.unreadTitle]}>
                {notification.title}
              </Text>
              <Text style={styles.category}>{notification.category}</Text>
            </View>
          </View>

          {/* Time and status */}
          <View style={styles.rightHeader}>
            <Text style={styles.timeText}>{formatDate(notification.date)}</Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          </View>
        </View>

        {/* Description */}
        <Text
          style={[
            styles.description,
            !notification.isRead && styles.unreadDescription,
          ]}
          numberOfLines={2}
        >
          {notification.description}
        </Text>

        {/* Action button */}
        {notification.actionText && showActions && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{notification.actionText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  unreadCard: {
    backgroundColor: '#F8F9FF',
    borderColor: '#E6EAFF',
  },
  disabledCard: {
    opacity: 0.6,
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  priorityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typeIconText: {
    fontSize: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#000',
  },
  category: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  unreadDescription: {
    color: '#333',
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationCard;
