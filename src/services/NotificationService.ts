import { 
  ExtendedMessage, 
  NotificationSettings, 
  NotificationFilters, 
  NotificationResponse,
  NotificationUpdateResponse,
  NotificationAction 
} from '../types/notifications';

// Mock notification data
const mockNotifications: ExtendedMessage[] = [
  {
    id: '1',
    title: 'New Follower',
    description: 'Sarah Johnson started following you',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'new',
    type: 'new_follower',
    isRead: false,
    priority: 'medium',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    actionUrl: '/profile/sarah-johnson',
    actionText: 'View Profile'
  },
  {
    id: '2',
    title: 'Delivery Update',
    description: 'Your order #12345 has been delivered successfully',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'downloaded',
    type: 'delivery',
    isRead: true,
    priority: 'high',
    category: 'Orders',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=150&h=150&fit=crop',
    actionUrl: '/orders/12345',
    actionText: 'View Order'
  },
  {
    id: '3',
    title: 'New Recommendations',
    description: 'We found 5 new items you might like based on your interests',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: 'new',
    type: 'recommendations',
    isRead: false,
    priority: 'low',
    category: 'Recommendations',
    actionUrl: '/recommendations',
    actionText: 'View All'
  },
  {
    id: '4',
    title: 'Referral Bonus',
    description: 'You earned $10 for referring Alex Thompson!',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'new',
    type: 'referrals',
    isRead: false,
    priority: 'high',
    category: 'Rewards',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    actionUrl: '/referrals',
    actionText: 'View Earnings'
  },
  {
    id: '5',
    title: 'Reward Points',
    description: 'You have 500 points expiring in 7 days',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: 'red',
    type: 'rewards',
    isRead: true,
    priority: 'medium',
    category: 'Rewards',
    actionUrl: '/rewards',
    actionText: 'Use Points'
  },
  {
    id: '6',
    title: 'Account Security',
    description: 'New login detected from iPhone in New York',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: 'new',
    type: 'account',
    isRead: false,
    priority: 'high',
    category: 'Security',
    actionUrl: '/security',
    actionText: 'Review Activity'
  }
];

// Mock notification settings
const mockSettings: NotificationSettings[] = [
  {
    id: 'new_follower',
    type: 'new_follower',
    label: 'New Followers',
    description: 'Get notified when someone follows you',
    enabled: true,
    pushEnabled: true,
    emailEnabled: false
  },
  {
    id: 'delivery',
    type: 'delivery',
    label: 'Delivery Updates',
    description: 'Order status and delivery notifications',
    enabled: true,
    pushEnabled: true,
    emailEnabled: true
  },
  {
    id: 'recommendations',
    type: 'recommendations',
    label: 'Recommendations',
    description: 'Personalized product recommendations',
    enabled: true,
    pushEnabled: false,
    emailEnabled: true
  },
  {
    id: 'referrals',
    type: 'referrals',
    label: 'Referral Program',
    description: 'Updates about your referrals and bonuses',
    enabled: true,
    pushEnabled: true,
    emailEnabled: true
  },
  {
    id: 'rewards',
    type: 'rewards',
    label: 'Rewards & Points',
    description: 'Points balance and reward opportunities',
    enabled: true,
    pushEnabled: true,
    emailEnabled: false
  },
  {
    id: 'account',
    type: 'account',
    label: 'Account Security',
    description: 'Security alerts and account changes',
    enabled: true,
    pushEnabled: true,
    emailEnabled: true
  }
];

export class NotificationService {
  private static notifications: ExtendedMessage[] = [...mockNotifications];
  private static settings: NotificationSettings[] = [...mockSettings];

  // Fetch notifications with optional filtering
  static async fetchNotifications(
    filters?: NotificationFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredNotifications = [...this.notifications];

        // Apply filters
        if (filters) {
          if (filters.status) {
            filteredNotifications = filteredNotifications.filter(n => 
              filters.status!.includes(n.status)
            );
          }
          if (filters.type) {
            filteredNotifications = filteredNotifications.filter(n => 
              filters.type!.includes(n.type)
            );
          }
          if (filters.isRead !== undefined) {
            filteredNotifications = filteredNotifications.filter(n => 
              n.isRead === filters.isRead
            );
          }
          if (filters.priority) {
            filteredNotifications = filteredNotifications.filter(n => 
              filters.priority!.includes(n.priority)
            );
          }
        }

        // Sort by date (newest first)
        filteredNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

        resolve({
          notifications: paginatedNotifications,
          total: filteredNotifications.length,
          hasMore: endIndex < filteredNotifications.length
        });
      }, 500); // Simulate network delay
    });
  }

  // Get a single notification by ID
  static async getNotification(id: string): Promise<ExtendedMessage | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.notifications.find(n => n.id === id);
        resolve(notification || null);
      }, 200);
    });
  }

  // Update notification (mark as read, delete, etc.)
  static async updateNotification(
    id: string, 
    action: NotificationAction,
    data?: Partial<ExtendedMessage>
  ): Promise<NotificationUpdateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notificationIndex = this.notifications.findIndex(n => n.id === id);
        
        if (notificationIndex === -1) {
          resolve({
            success: false,
            message: 'Notification not found'
          });
          return;
        }

        const notification = this.notifications[notificationIndex];

        switch (action) {
          case 'mark_read':
            notification.isRead = true;
            break;
          case 'mark_unread':
            notification.isRead = false;
            break;
          case 'delete':
            notification.status = 'deleted';
            break;
          case 'archive':
            // Custom logic for archiving
            notification.metadata = { ...notification.metadata, archived: true };
            break;
        }

        // Apply any additional data updates
        if (data) {
          Object.assign(notification, data);
        }

        this.notifications[notificationIndex] = notification;

        resolve({
          success: true,
          message: `Notification ${action.replace('_', ' ')} successfully`,
          updatedNotification: notification
        });
      }, 300);
    });
  }

  // Bulk update notifications
  static async bulkUpdateNotifications(
    ids: string[],
    action: NotificationAction
  ): Promise<NotificationUpdateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let updatedCount = 0;

        ids.forEach(id => {
          const notificationIndex = this.notifications.findIndex(n => n.id === id);
          if (notificationIndex !== -1) {
            const notification = this.notifications[notificationIndex];
            
            switch (action) {
              case 'mark_read':
                notification.isRead = true;
                break;
              case 'mark_unread':
                notification.isRead = false;
                break;
              case 'delete':
                notification.status = 'deleted';
                break;
            }
            
            updatedCount++;
          }
        });

        resolve({
          success: true,
          message: `${updatedCount} notifications updated successfully`
        });
      }, 500);
    });
  }

  // Get notification settings
  static async getSettings(): Promise<NotificationSettings[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.settings]);
      }, 200);
    });
  }

  // Update notification settings
  static async updateSettings(
    settingId: string,
    updates: Partial<NotificationSettings>
  ): Promise<NotificationUpdateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const settingIndex = this.settings.findIndex(s => s.id === settingId);
        
        if (settingIndex === -1) {
          resolve({
            success: false,
            message: 'Setting not found'
          });
          return;
        }

        this.settings[settingIndex] = {
          ...this.settings[settingIndex],
          ...updates
        };

        resolve({
          success: true,
          message: 'Settings updated successfully'
        });
      }, 300);
    });
  }

  // Get unread count
  static async getUnreadCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unreadCount = this.notifications.filter(n => 
          !n.isRead && n.status !== 'deleted'
        ).length;
        resolve(unreadCount);
      }, 100);
    });
  }

  // Mark all as read
  static async markAllAsRead(): Promise<NotificationUpdateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notifications.forEach(notification => {
          if (notification.status !== 'deleted') {
            notification.isRead = true;
          }
        });

        resolve({
          success: true,
          message: 'All notifications marked as read'
        });
      }, 400);
    });
  }
}

export default NotificationService;
