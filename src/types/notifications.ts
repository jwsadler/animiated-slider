export interface Message {
  date: Date;
  description: string;
  status: 'new' | 'downloaded' | 'red' | 'deleted';
  title: string;
  type: 
    | 'new_follower'
    | 'delivery'
    | 'recommendations'
    | 'referrals'
    | 'rewards'
    | 'account';
}

// Extended notification interface with additional properties
export interface ExtendedMessage extends Message {
  id: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  imageUrl?: string;
  actionUrl?: string;
  actionText?: string;
  category: string;
  metadata?: Record<string, any>;
}

// Notification settings interface
export interface NotificationSettings {
  id: string;
  type: Message['type'];
  label: string;
  description: string;
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

// Filter options for notifications
export interface NotificationFilters {
  status?: Message['status'][];
  type?: Message['type'][];
  isRead?: boolean;
  priority?: ExtendedMessage['priority'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Notification action types
export type NotificationAction = 
  | 'mark_read'
  | 'mark_unread'
  | 'delete'
  | 'archive'
  | 'open_link';

// Service response types
export interface NotificationResponse {
  notifications: ExtendedMessage[];
  total: number;
  hasMore: boolean;
}

export interface NotificationUpdateResponse {
  success: boolean;
  message?: string;
  updatedNotification?: ExtendedMessage;
}
