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

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        disabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* White circle on the left */}
        <View style={styles.circle} />
        
        {/* Content on the right */}
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {notification.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: designTokens.colors.neutral[200], // Light gray background
    borderRadius: designTokens.borderRadius['2xl'], // 16px rounded corners
    marginHorizontal: designTokens.spacing.md,
    marginVertical: designTokens.spacing.sm,
    padding: designTokens.spacing.md,
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designTokens.colors.neutral[0], // White circle
    marginRight: designTokens.spacing.md,
    flexShrink: 0,
  },
  textContent: {
    flex: 1,
    paddingTop: 2, // Slight adjustment to align with circle
  },
  title: {
    fontSize: designTokens.typography.sizes.lg, // 18px
    fontWeight: designTokens.typography.weights.semibold,
    color: designTokens.colors.neutral[1000],
    marginBottom: designTokens.spacing.xs,
    lineHeight: designTokens.typography.sizes.lg * designTokens.typography.lineHeights.tight,
  },
  description: {
    fontSize: designTokens.typography.sizes.sm, // 14px
    fontWeight: designTokens.typography.weights.normal,
    color: designTokens.colors.neutral[600],
    lineHeight: designTokens.typography.sizes.sm * designTokens.typography.lineHeights.relaxed,
  },
});

export default NotificationCard;
