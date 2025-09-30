import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopNotification, NotificationStyle } from './TopNotification';
import { NotificationState } from '../hooks/useNotification';

export interface NotificationContainerProps {
  /** Array of notifications to display */
  notifications: NotificationState[];
  /** Callback when a notification is dismissed */
  onDismiss: (id: string) => void;
  /** Callback when a notification animation completes and should be removed */
  onRemove: (id: string) => void;
  /** Global custom styling overrides */
  globalCustomStyle?: Partial<NotificationStyle>;
  /** Global animation duration in milliseconds */
  globalAnimationDuration?: number;
  /** Maximum number of notifications to show simultaneously */
  maxNotifications?: number;
  /** Spacing between multiple notifications */
  notificationSpacing?: number;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
  onRemove,
  globalCustomStyle,
  globalAnimationDuration,
  maxNotifications = 3,
  notificationSpacing = 8,
}) => {
  // Show only the most recent notifications up to maxNotifications
  const visibleNotifications = notifications.slice(-maxNotifications);

  const handleDismiss = (id: string) => {
    onDismiss(id);
    // Remove the notification after animation completes
    setTimeout(() => {
      onRemove(id);
    }, globalAnimationDuration || 300);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {visibleNotifications.map((notification, index) => (
        <View
          key={notification.id}
          style={[
            styles.notificationWrapper,
            {
              top: index * (56 + notificationSpacing), // 56 is minHeight from TopNotification
            },
          ]}
        >
          <TopNotification
            visible={notification.visible}
            message={notification.config.message}
            type={notification.config.type}
            icon={notification.config.icon}
            duration={notification.config.duration}
            dismissible={notification.config.dismissible}
            onDismiss={() => handleDismiss(notification.id)}
            customStyle={globalCustomStyle}
            animationDuration={globalAnimationDuration}
            showCloseButton={notification.config.showCloseButton}
            closeButtonText={notification.config.closeButtonText}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998, // Slightly lower than individual notifications
  },
  notificationWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

export default NotificationContainer;
