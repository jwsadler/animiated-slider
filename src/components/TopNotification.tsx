import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationStyle {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  borderColor?: string;
}

export interface TopNotificationProps {
  /** Whether the notification is visible */
  visible: boolean;
  /** The message to display */
  message: string;
  /** Type of notification (affects default styling) */
  type?: NotificationType;
  /** Custom icon to display (emoji or text) */
  icon?: string;
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Whether the notification can be manually dismissed */
  dismissible?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Custom styling overrides */
  customStyle?: Partial<NotificationStyle>;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to show a close button */
  showCloseButton?: boolean;
  /** Custom close button text/icon */
  closeButtonText?: string;
}

const defaultStyles: Record<NotificationType, NotificationStyle> = {
  success: {
    backgroundColor: '#10B981',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: '#059669',
  },
  error: {
    backgroundColor: '#EF4444',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: '#DC2626',
  },
  warning: {
    backgroundColor: '#F59E0B',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: '#D97706',
  },
  info: {
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: '#2563EB',
  },
};

const defaultIcons: Record<NotificationType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export const TopNotification: React.FC<TopNotificationProps> = ({
  visible,
  message,
  type = 'info',
  icon,
  duration = 4000,
  dismissible = true,
  onDismiss,
  customStyle = {},
  animationDuration = 300,
  showCloseButton = true,
  closeButtonText = '✕',
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  const notificationStyle = { ...defaultStyles[type], ...customStyle };
  const displayIcon = icon || defaultIcons[type];

  // Calculate top position accounting for status bar and safe area
  const getTopPosition = () => {
    const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0;
    return Math.max(insets.top, statusBarHeight);
  };

  const showNotification = () => {
    setIsVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: getTopPosition(),
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after duration
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        hideNotification();
      }, duration);
    }
  };

  const hideNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  const handleDismiss = () => {
    if (dismissible) {
      hideNotification();
    }
  };

  useEffect(() => {
    if (visible) {
      showNotification();
    } else {
      hideNotification();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    // Reset animation values when component unmounts or visibility changes
    return () => {
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: notificationStyle.backgroundColor,
          borderBottomColor: notificationStyle.borderColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handleDismiss}
        disabled={!dismissible}
        activeOpacity={dismissible ? 0.8 : 1}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: notificationStyle.iconColor }]}>
            {displayIcon}
          </Text>
        </View>

        {/* Message */}
        <Text
          style={[styles.message, { color: notificationStyle.textColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {message}
        </Text>

        {/* Close Button */}
        {showCloseButton && dismissible && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.closeButtonText, { color: notificationStyle.textColor }]}>
              {closeButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  iconContainer: {
    marginRight: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopNotification;
