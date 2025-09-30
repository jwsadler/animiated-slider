import { useState, useCallback, useRef } from 'react';
import { NotificationType } from '../components/TopNotification';

export interface NotificationConfig {
  message: string;
  type?: NotificationType;
  icon?: string;
  duration?: number;
  dismissible?: boolean;
  showCloseButton?: boolean;
  closeButtonText?: string;
}

export interface NotificationState {
  id: string;
  visible: boolean;
  config: NotificationConfig;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const idCounter = useRef(0);

  const show = useCallback((config: NotificationConfig) => {
    const id = `notification-${++idCounter.current}`;
    const notification: NotificationState = {
      id,
      visible: true,
      config,
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const hide = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, visible: false }
          : notification
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message: string, options?: Partial<NotificationConfig>) => {
    return show({ message, type: 'success', ...options });
  }, [show]);

  const showError = useCallback((message: string, options?: Partial<NotificationConfig>) => {
    return show({ message, type: 'error', ...options });
  }, [show]);

  const showWarning = useCallback((message: string, options?: Partial<NotificationConfig>) => {
    return show({ message, type: 'warning', ...options });
  }, [show]);

  const showInfo = useCallback((message: string, options?: Partial<NotificationConfig>) => {
    return show({ message, type: 'info', ...options });
  }, [show]);

  return {
    notifications,
    show,
    hide,
    remove,
    clear,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
