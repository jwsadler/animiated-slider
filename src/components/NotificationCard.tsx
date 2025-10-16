import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { ExtendedMessage } from '../types/notifications';
import { designTokens } from '../design-system/design-tokens';
import { componentStyles } from '../design-system/component-styles';
import { Logger } from '../services/Logger';

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
      Logger.userAction('NotificationCard', 'notification_press', {
        notificationId: notification.id,
        notificationType: notification.type,
        isRead: notification.isRead
      });
      onPress(notification);
    }
  };

  const handleLongPress = () => {
    if (!disabled && onLongPress) {
      Logger.userAction('NotificationCard', 'notification_long_press', {
        notificationId: notification.id,
        notificationType: notification.type
      });
      onLongPress(notification);
    }
  };

  const getStatusColor = () => {
    switch (notification.status) {
      case 'new':
        return designTokens.colors.info;
      case 'downloaded':
        return designTokens.colors.success;
      case 'red':
        return designTokens.colors.error;
      case 'deleted':
        return designTokens.colors.neutral[450];
      default:
        return designTokens.colors.neutral[450];
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return designTokens.colors.error;
      case 'medium':
        return designTokens.colors.warning;
      case 'low':
        return designTokens.colors.neutral[450];
      default:
        return designTokens.colors.neutral[450];
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
    backgroundColor: designTokens.colors.neutral[0],
    borderRadius: designTokens.borderRadius.xl,
    marginHorizontal: designTokens.spacing.md,
    marginVertical: designTokens.spacing.xs + 2,
    padding: designTokens.spacing.md,
    position: 'relative',
    ...designTokens.shadows.md,
    ...designTokens.borders.sm,
  },
  unreadCard: {
    backgroundColor: designTokens.colors.primary[50],
    borderColor: designTokens.colors.primary[500],
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
    borderTopLeftRadius: designTokens.borderRadius.xl,
    borderBottomLeftRadius: designTokens.borderRadius.xl,
  },
  priorityIndicator: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
    width: designTokens.spacing.sm,
    height: designTokens.spacing.sm,
    borderRadius: designTokens.spacing.sm / 2,
  },
  cardContent: {
    flex: 1,
    paddingLeft: designTokens.spacing.sm,
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
    ...componentStyles.text.variants.h6,
    color: componentStyles.text.colors.primary,
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.neutral[1000],
  },
  category: {
    ...componentStyles.text.variants.caption,
    color: componentStyles.text.colors.tertiary,
    fontWeight: designTokens.typography.weights.medium,
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
    ...componentStyles.text.variants.body2,
    color: componentStyles.text.colors.secondary,
    marginBottom: designTokens.spacing.sm,
  },
  unreadDescription: {
    color: componentStyles.text.colors.primary,
    fontWeight: designTokens.typography.weights.medium,
  },
  actionContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  actionButton: {
    ...componentStyles.button.base,
    ...componentStyles.button.variants.primary,
    ...componentStyles.button.sizes.small,
  },
  actionButtonText: {
    ...componentStyles.text.variants.buttonSmall,
    color: componentStyles.button.variants.primary.textColor,
  },
});

export default NotificationCard;
