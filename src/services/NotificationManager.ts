// src/services/NotificationManager.ts
import { ExtendedMessage } from '../types/notifications';
import { FirebaseNotificationService } from './FirebaseNotificationService';
import { FirestoreNotificationService, NotificationFilter, NotificationListener } from './FirestoreNotificationService';
import { EventEmitter } from 'events';
import { 
  initializeExtendedFirebase,
  logInfo,
  logError 
} from '../config/firebase-integration';

export interface NotificationManagerEvents {
  'notifications_updated': (notifications: ExtendedMessage[]) => void;
  'unread_count_changed': (count: number) => void;
  'notification_received': (notification: ExtendedMessage) => void;
  'error': (error: Error) => void;
}

export class NotificationManager extends EventEmitter {
  private static instance: NotificationManager;
  private fcmService: FirebaseNotificationService;
  private firestoreService: FirestoreNotificationService;
  private currentUserId: string | null = null;
  private notificationListenerId: string | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    super();
    this.fcmService = FirebaseNotificationService.getInstance();
    this.firestoreService = FirestoreNotificationService.getInstance();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Initialize the notification system for a user
   */
  async initialize(userId: string): Promise<void> {
    try {
      if (this.isInitialized && this.currentUserId === userId) {
        logInfo('NotificationManager: Already initialized for user:', userId);
        return;
      }

      // Initialize extended Firebase services first
      await initializeExtendedFirebase();

      // Clean up previous initialization
      if (this.isInitialized) {
        await this.cleanup();
      }

      this.currentUserId = userId;

      // Initialize FCM service
      await this.fcmService.initialize(userId);

      // Set up real-time notification listener
      await this.setupNotificationListener();

      // Update unread count
      await this.updateUnreadCount();

      this.isInitialized = true;
      logInfo('NotificationManager: Initialized successfully for user:', userId);
    } catch (error) {
      logError('NotificationManager: Initialization failed', error as Error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Set up real-time notification listener
   */
  private async setupNotificationListener(): Promise<void> {
    if (!this.currentUserId) return;

    const callback: NotificationListener = (notifications) => {
      this.emit('notifications_updated', notifications);
      this.updateUnreadCount();
    };

    this.notificationListenerId = this.firestoreService.setupNotificationListener(
      this.currentUserId,
      callback,
      { limit: 50 } // Limit to recent 50 notifications
    );
  }

  /**
   * Get notifications with filtering and pagination
   */
  async getNotifications(filter: NotificationFilter = {}): Promise<ExtendedMessage[]> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      const result = await this.firestoreService.getNotifications(this.currentUserId, filter);
      return result.notifications;
    } catch (error) {
      console.error('NotificationManager: Failed to get notifications:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(notificationId: string): Promise<ExtendedMessage | null> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      return await this.firestoreService.getNotification(this.currentUserId, notificationId);
    } catch (error) {
      console.error('NotificationManager: Failed to get notification:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      await this.firestoreService.markAsRead(this.currentUserId, notificationId);
      await this.updateUnreadCount();
    } catch (error) {
      console.error('NotificationManager: Failed to mark as read:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId: string): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      await this.firestoreService.markAsUnread(this.currentUserId, notificationId);
      await this.updateUnreadCount();
    } catch (error) {
      console.error('NotificationManager: Failed to mark as unread:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      await this.firestoreService.deleteNotification(this.currentUserId, notificationId);
      await this.updateUnreadCount();
    } catch (error) {
      console.error('NotificationManager: Failed to delete notification:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    try {
      await this.firestoreService.markMultipleAsRead(this.currentUserId, notificationIds);
      await this.updateUnreadCount();
    } catch (error) {
      console.error('NotificationManager: Failed to mark multiple as read:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    if (!this.currentUserId) {
      return 0;
    }

    try {
      return await this.firestoreService.getUnreadCount(this.currentUserId);
    } catch (error) {
      console.error('NotificationManager: Failed to get unread count:', error);
      this.emit('error', error);
      return 0;
    }
  }

  /**
   * Update and emit unread count
   */
  private async updateUnreadCount(): Promise<void> {
    try {
      const count = await this.getUnreadCount();
      this.emit('unread_count_changed', count);
    } catch (error) {
      console.error('NotificationManager: Failed to update unread count:', error);
    }
  }

  /**
   * Create a test notification (for development/testing)
   */
  async createTestNotification(): Promise<string> {
    if (!this.currentUserId) {
      throw new Error('NotificationManager not initialized. Call initialize() first.');
    }

    const testNotification = {
      title: 'Test Notification',
      description: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
      type: 'account' as const,
      status: 'new' as const,
      priority: 'medium' as const,
      category: 'Test',
      isRead: false,
      actionText: 'View Details',
      actionUrl: 'https://example.com/test',
      metadata: {
        testData: true,
        createdBy: 'NotificationManager'
      }
    };

    try {
      return await this.firestoreService.createNotification(this.currentUserId, testNotification);
    } catch (error) {
      console.error('NotificationManager: Failed to create test notification:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Refresh FCM token
   */
  async refreshFCMToken(): Promise<string | null> {
    try {
      return await this.fcmService.refreshToken();
    } catch (error) {
      console.error('NotificationManager: Failed to refresh FCM token:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Get current FCM token
   */
  getCurrentFCMToken(): string | null {
    return this.fcmService.getCurrentToken();
  }

  /**
   * Check if manager is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Clean up all services and listeners
   */
  async cleanup(): Promise<void> {
    try {
      // Remove notification listener
      if (this.notificationListenerId) {
        this.firestoreService.removeListener(this.notificationListenerId);
        this.notificationListenerId = null;
      }

      // Clean up FCM service
      this.fcmService.cleanup();

      // Remove all event listeners
      this.removeAllListeners();

      this.currentUserId = null;
      this.isInitialized = false;

      console.log('NotificationManager: Cleaned up successfully');
    } catch (error) {
      console.error('NotificationManager: Cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Handle app state changes (foreground/background)
   */
  handleAppStateChange(nextAppState: string): void {
    if (nextAppState === 'active' && this.isInitialized) {
      // App came to foreground, refresh data
      this.updateUnreadCount();
    }
  }

  /**
   * Event listener helpers
   */
  onNotificationsUpdated(callback: (notifications: ExtendedMessage[]) => void): void {
    this.on('notifications_updated', callback);
  }

  onUnreadCountChanged(callback: (count: number) => void): void {
    this.on('unread_count_changed', callback);
  }

  onNotificationReceived(callback: (notification: ExtendedMessage) => void): void {
    this.on('notification_received', callback);
  }

  onError(callback: (error: Error) => void): void {
    this.on('error', callback);
  }

  /**
   * Remove specific event listeners
   */
  offNotificationsUpdated(callback: (notifications: ExtendedMessage[]) => void): void {
    this.off('notifications_updated', callback);
  }

  offUnreadCountChanged(callback: (count: number) => void): void {
    this.off('unread_count_changed', callback);
  }

  offNotificationReceived(callback: (notification: ExtendedMessage) => void): void {
    this.off('notification_received', callback);
  }

  offError(callback: (error: Error) => void): void {
    this.off('error', callback);
  }
}

export default NotificationManager;
