// src/services/NotificationService.firebase.ts
import { 
  ExtendedMessage, 
  NotificationSettings, 
  NotificationFilters, 
  NotificationResponse,
  NotificationUpdateResponse,
  NotificationAction 
} from '../types/notifications';
import { Logger } from './Logger';
import { NotificationManager } from './NotificationManager';
import { FirestoreNotificationService, NotificationFilter } from './FirestoreNotificationService';

export class NotificationService {
  private static instance: NotificationService;
  private notificationManager: NotificationManager;
  private firestoreService: FirestoreNotificationService;
  private logger: Logger;
  private currentUserId: string | null = null;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.firestoreService = FirestoreNotificationService.getInstance();
    this.logger = Logger.getInstance();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize the service for a specific user
   */
  async initialize(userId: string): Promise<void> {
    try {
      this.currentUserId = userId;
      await this.notificationManager.initialize(userId);
      this.logger.info('NotificationService initialized for user:', userId);
    } catch (error) {
      this.logger.error('Failed to initialize NotificationService:', error);
      throw error;
    }
  }

  /**
   * Get notifications with filtering and pagination
   */
  async getNotifications(
    filters: NotificationFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationResponse> {
    try {
      this.ensureInitialized();

      // Convert our filters to Firestore filters
      const firestoreFilter: NotificationFilter = {
        limit,
        // Add pagination logic here if needed
      };

      // Apply type filters
      if (filters.types && filters.types.length > 0) {
        firestoreFilter.type = filters.types;
      }

      // Apply status filters
      if (filters.statuses && filters.statuses.length > 0) {
        firestoreFilter.status = filters.statuses;
      }

      // Apply read status filter
      if (filters.isRead !== undefined) {
        firestoreFilter.isRead = filters.isRead;
      }

      const notifications = await this.notificationManager.getNotifications(firestoreFilter);

      // Apply additional client-side filtering if needed
      let filteredNotifications = notifications;

      // Filter by date range
      if (filters.dateFrom || filters.dateTo) {
        filteredNotifications = filteredNotifications.filter(notification => {
          const notificationDate = notification.date;
          if (filters.dateFrom && notificationDate < filters.dateFrom) return false;
          if (filters.dateTo && notificationDate > filters.dateTo) return false;
          return true;
        });
      }

      // Apply search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredNotifications = filteredNotifications.filter(notification =>
          notification.title.toLowerCase().includes(query) ||
          notification.description.toLowerCase().includes(query)
        );
      }

      // Calculate pagination info
      const totalCount = filteredNotifications.length;
      const totalPages = Math.ceil(totalCount / limit);
      const hasMore = page < totalPages;

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + limit);

      this.logger.info(`Retrieved ${paginatedNotifications.length} notifications for page ${page}`);

      return {
        notifications: paginatedNotifications,
        totalCount,
        currentPage: page,
        totalPages,
        hasMore,
        unreadCount: await this.notificationManager.getUnreadCount()
      };
    } catch (error) {
      this.logger.error('Failed to get notifications:', error);
      throw error;
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(id: string): Promise<ExtendedMessage | null> {
    try {
      this.ensureInitialized();
      const notification = await this.notificationManager.getNotification(id);
      
      if (notification) {
        this.logger.info('Retrieved notification:', id);
      } else {
        this.logger.warn('Notification not found:', id);
      }

      return notification;
    } catch (error) {
      this.logger.error('Failed to get notification:', error);
      throw error;
    }
  }

  /**
   * Update a notification (mark as read, delete, etc.)
   */
  async updateNotification(id: string, action: NotificationAction): Promise<NotificationUpdateResponse> {
    try {
      this.ensureInitialized();

      switch (action) {
        case 'mark_read':
          await this.notificationManager.markAsRead(id);
          break;
        case 'mark_unread':
          await this.notificationManager.markAsUnread(id);
          break;
        case 'delete':
          await this.notificationManager.deleteNotification(id);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      this.logger.info(`Notification ${id} updated with action: ${action}`);

      return {
        success: true,
        message: `Notification ${action.replace('_', ' ')} successfully`,
        unreadCount: await this.notificationManager.getUnreadCount()
      };
    } catch (error) {
      this.logger.error(`Failed to update notification ${id}:`, error);
      return {
        success: false,
        message: `Failed to ${action.replace('_', ' ')} notification`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(ids: string[]): Promise<NotificationUpdateResponse> {
    try {
      this.ensureInitialized();
      await this.notificationManager.markMultipleAsRead(ids);

      this.logger.info(`Marked ${ids.length} notifications as read`);

      return {
        success: true,
        message: `${ids.length} notifications marked as read`,
        unreadCount: await this.notificationManager.getUnreadCount()
      };
    } catch (error) {
      this.logger.error('Failed to mark multiple notifications as read:', error);
      return {
        success: false,
        message: 'Failed to mark notifications as read',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      this.ensureInitialized();
      const count = await this.notificationManager.getUnreadCount();
      this.logger.info('Unread count:', count);
      return count;
    } catch (error) {
      this.logger.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings[]> {
    try {
      this.ensureInitialized();
      
      if (!this.currentUserId) {
        throw new Error('User ID not available');
      }

      const settings = await this.firestoreService.getNotificationSettings(this.currentUserId);
      this.logger.info('Retrieved notification settings');
      return settings;
    } catch (error) {
      this.logger.error('Failed to get notification settings:', error);
      
      // Return default settings if none exist
      return this.getDefaultSettings();
    }
  }

  /**
   * Update notification settings
   */
  async updateSettings(settingId: string, updates: Partial<NotificationSettings>): Promise<void> {
    try {
      this.ensureInitialized();
      
      if (!this.currentUserId) {
        throw new Error('User ID not available');
      }

      await this.firestoreService.updateNotificationSettings(this.currentUserId, settingId, updates);
      this.logger.info('Updated notification settings:', settingId);
    } catch (error) {
      this.logger.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * Create a test notification (for development)
   */
  async createTestNotification(): Promise<string> {
    try {
      this.ensureInitialized();
      const notificationId = await this.notificationManager.createTestNotification();
      this.logger.info('Created test notification:', notificationId);
      return notificationId;
    } catch (error) {
      this.logger.error('Failed to create test notification:', error);
      throw error;
    }
  }

  /**
   * Set up real-time listeners
   */
  setupRealtimeListeners(callbacks: {
    onNotificationsUpdated?: (notifications: ExtendedMessage[]) => void;
    onUnreadCountChanged?: (count: number) => void;
    onError?: (error: Error) => void;
  }): void {
    if (callbacks.onNotificationsUpdated) {
      this.notificationManager.onNotificationsUpdated(callbacks.onNotificationsUpdated);
    }

    if (callbacks.onUnreadCountChanged) {
      this.notificationManager.onUnreadCountChanged(callbacks.onUnreadCountChanged);
    }

    if (callbacks.onError) {
      this.notificationManager.onError(callbacks.onError);
    }

    this.logger.info('Real-time listeners set up');
  }

  /**
   * Remove real-time listeners
   */
  removeRealtimeListeners(callbacks: {
    onNotificationsUpdated?: (notifications: ExtendedMessage[]) => void;
    onUnreadCountChanged?: (count: number) => void;
    onError?: (error: Error) => void;
  }): void {
    if (callbacks.onNotificationsUpdated) {
      this.notificationManager.offNotificationsUpdated(callbacks.onNotificationsUpdated);
    }

    if (callbacks.onUnreadCountChanged) {
      this.notificationManager.offUnreadCountChanged(callbacks.onUnreadCountChanged);
    }

    if (callbacks.onError) {
      this.notificationManager.offError(callbacks.onError);
    }

    this.logger.info('Real-time listeners removed');
  }

  /**
   * Get current FCM token
   */
  getCurrentFCMToken(): string | null {
    return this.notificationManager.getCurrentFCMToken();
  }

  /**
   * Refresh FCM token
   */
  async refreshFCMToken(): Promise<string | null> {
    try {
      const token = await this.notificationManager.refreshFCMToken();
      this.logger.info('FCM token refreshed');
      return token;
    } catch (error) {
      this.logger.error('Failed to refresh FCM token:', error);
      return null;
    }
  }

  /**
   * Handle app state changes
   */
  handleAppStateChange(nextAppState: string): void {
    this.notificationManager.handleAppStateChange(nextAppState);
  }

  /**
   * Clean up the service
   */
  async cleanup(): Promise<void> {
    try {
      await this.notificationManager.cleanup();
      this.currentUserId = null;
      this.logger.info('NotificationService cleaned up');
    } catch (error) {
      this.logger.error('Failed to cleanup NotificationService:', error);
      throw error;
    }
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.notificationManager.getIsInitialized();
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Private helper methods
   */
  private ensureInitialized(): void {
    if (!this.isInitialized()) {
      throw new Error('NotificationService not initialized. Call initialize() first.');
    }
  }

  private getDefaultSettings(): NotificationSettings[] {
    return [
      {
        id: 'new_followers',
        userId: this.currentUserId || '',
        type: 'new_follower',
        label: 'New Followers',
        description: 'Get notified when someone follows you',
        enabled: true,
        pushEnabled: true,
        emailEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'delivery_updates',
        userId: this.currentUserId || '',
        type: 'delivery',
        label: 'Delivery Updates',
        description: 'Get notified about order deliveries',
        enabled: true,
        pushEnabled: true,
        emailEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'recommendations',
        userId: this.currentUserId || '',
        type: 'recommendations',
        label: 'Recommendations',
        description: 'Get personalized recommendations',
        enabled: true,
        pushEnabled: false,
        emailEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'referrals',
        userId: this.currentUserId || '',
        type: 'referrals',
        label: 'Referrals',
        description: 'Get notified about referral opportunities',
        enabled: false,
        pushEnabled: false,
        emailEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'rewards',
        userId: this.currentUserId || '',
        type: 'rewards',
        label: 'Rewards',
        description: 'Get notified about rewards and achievements',
        enabled: true,
        pushEnabled: true,
        emailEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'account',
        userId: this.currentUserId || '',
        type: 'account',
        label: 'Account Updates',
        description: 'Get notified about account changes',
        enabled: true,
        pushEnabled: true,
        emailEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
export default NotificationService;

