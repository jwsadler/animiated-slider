// src/services/FirestoreNotificationService.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { 
  db, 
  FirebaseNotification, 
  NotificationSettings,
  getUserNotificationPath,
  getUserSettingsPath 
} from '../config/firebase';
import { ExtendedMessage } from '../types/notifications';

export interface NotificationFilter {
  type?: string[];
  status?: string[];
  priority?: string[];
  isRead?: boolean;
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export interface NotificationListener {
  (notifications: ExtendedMessage[]): void;
}

export class FirestoreNotificationService {
  private static instance: FirestoreNotificationService;
  private listeners: Map<string, Unsubscribe> = new Map();

  private constructor() {}

  static getInstance(): FirestoreNotificationService {
    if (!FirestoreNotificationService.instance) {
      FirestoreNotificationService.instance = new FirestoreNotificationService();
    }
    return FirestoreNotificationService.instance;
  }

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string, 
    notificationData: Omit<FirebaseNotification, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ): Promise<string> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      const notificationsRef = collection(db, notificationPath);

      const docData = {
        ...notificationData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(notificationsRef, docData);
      console.log('Notification created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(userId: string, notificationId: string): Promise<ExtendedMessage | null> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      const docRef = doc(db, notificationPath, notificationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.convertFirebaseToExtended(docSnap.id, docSnap.data() as FirebaseNotification);
      }
      return null;
    } catch (error) {
      console.error('Failed to get notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications with filtering and pagination
   */
  async getNotifications(
    userId: string, 
    filter: NotificationFilter = {}
  ): Promise<{ notifications: ExtendedMessage[]; lastDoc?: DocumentSnapshot }> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      let q = query(
        collection(db, notificationPath),
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (filter.type && filter.type.length > 0) {
        q = query(q, where('type', 'in', filter.type));
      }

      if (filter.status && filter.status.length > 0) {
        q = query(q, where('status', 'in', filter.status));
      }

      if (filter.priority && filter.priority.length > 0) {
        q = query(q, where('priority', 'in', filter.priority));
      }

      if (filter.isRead !== undefined) {
        q = query(q, where('isRead', '==', filter.isRead));
      }

      // Apply pagination
      if (filter.startAfter) {
        q = query(q, startAfter(filter.startAfter));
      }

      if (filter.limit) {
        q = query(q, limit(filter.limit));
      }

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => 
        this.convertFirebaseToExtended(doc.id, doc.data() as FirebaseNotification)
      );

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { notifications, lastDoc };
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  /**
   * Update a notification
   */
  async updateNotification(
    userId: string, 
    notificationId: string, 
    updates: Partial<FirebaseNotification>
  ): Promise<void> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      const docRef = doc(db, notificationPath, notificationId);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      console.log('Notification updated:', notificationId);
    } catch (error) {
      console.error('Failed to update notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.updateNotification(userId, notificationId, { 
      isRead: true, 
      status: 'read' 
    });
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(userId: string, notificationId: string): Promise<void> {
    await this.updateNotification(userId, notificationId, { 
      isRead: false, 
      status: 'new' 
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      const docRef = doc(db, notificationPath, notificationId);
      await deleteDoc(docRef);
      console.log('Notification deleted:', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * Bulk mark notifications as read
   */
  async markMultipleAsRead(userId: string, notificationIds: string[]): Promise<void> {
    try {
      const promises = notificationIds.map(id => 
        this.markAsRead(userId, id)
      );
      await Promise.all(promises);
      console.log('Bulk marked as read:', notificationIds.length, 'notifications');
    } catch (error) {
      console.error('Failed to bulk mark as read:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notificationPath = getUserNotificationPath(userId);
      const q = query(
        collection(db, notificationPath),
        where('isRead', '==', false),
        where('status', '!=', 'deleted')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Set up real-time listener for notifications
   */
  setupNotificationListener(
    userId: string, 
    callback: NotificationListener,
    filter: NotificationFilter = {}
  ): string {
    const listenerId = `notifications_${userId}_${Date.now()}`;

    try {
      const notificationPath = getUserNotificationPath(userId);
      let q = query(
        collection(db, notificationPath),
        orderBy('createdAt', 'desc')
      );

      // Apply filters (similar to getNotifications)
      if (filter.type && filter.type.length > 0) {
        q = query(q, where('type', 'in', filter.type));
      }

      if (filter.status && filter.status.length > 0) {
        q = query(q, where('status', 'in', filter.status));
      }

      if (filter.isRead !== undefined) {
        q = query(q, where('isRead', '==', filter.isRead));
      }

      if (filter.limit) {
        q = query(q, limit(filter.limit));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifications = querySnapshot.docs.map(doc => 
          this.convertFirebaseToExtended(doc.id, doc.data() as FirebaseNotification)
        );
        callback(notifications);
      }, (error) => {
        console.error('Notification listener error:', error);
      });

      this.listeners.set(listenerId, unsubscribe);
      console.log('Notification listener set up:', listenerId);
      return listenerId;
    } catch (error) {
      console.error('Failed to set up notification listener:', error);
      throw error;
    }
  }

  /**
   * Remove a specific listener
   */
  removeListener(listenerId: string): void {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
      console.log('Notification listener removed:', listenerId);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.forEach((unsubscribe, listenerId) => {
      unsubscribe();
      console.log('Removed listener:', listenerId);
    });
    this.listeners.clear();
  }

  /**
   * Convert Firebase notification to ExtendedMessage format
   */
  private convertFirebaseToExtended(id: string, firebaseNotification: FirebaseNotification): ExtendedMessage {
    return {
      id,
      title: firebaseNotification.title,
      description: firebaseNotification.description,
      date: firebaseNotification.createdAt instanceof Timestamp 
        ? firebaseNotification.createdAt.toDate() 
        : firebaseNotification.createdAt,
      status: firebaseNotification.status,
      type: firebaseNotification.type,
      category: firebaseNotification.category || '',
      priority: firebaseNotification.priority,
      isRead: firebaseNotification.isRead,
      actionText: firebaseNotification.actionText,
      actionUrl: firebaseNotification.actionUrl,
      imageUrl: firebaseNotification.imageUrl,
      metadata: firebaseNotification.metadata || {}
    };
  }

  /**
   * Convert ExtendedMessage to Firebase notification format
   */
  private convertExtendedToFirebase(
    userId: string, 
    extendedMessage: Omit<ExtendedMessage, 'id'>
  ): Omit<FirebaseNotification, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: extendedMessage.title,
      description: extendedMessage.description,
      type: extendedMessage.type,
      status: extendedMessage.status,
      priority: extendedMessage.priority,
      category: extendedMessage.category,
      imageUrl: extendedMessage.imageUrl,
      actionText: extendedMessage.actionText,
      actionUrl: extendedMessage.actionUrl,
      metadata: extendedMessage.metadata,
      isRead: extendedMessage.isRead,
      userId
    };
  }

  /**
   * Notification Settings Management
   */

  /**
   * Get notification settings for user
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings[]> {
    try {
      const settingsPath = getUserSettingsPath(userId);
      const querySnapshot = await getDocs(collection(db, settingsPath));
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NotificationSettings));
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    userId: string, 
    settingId: string, 
    updates: Partial<NotificationSettings>
  ): Promise<void> {
    try {
      const settingsPath = getUserSettingsPath(userId);
      const docRef = doc(db, settingsPath, settingId);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      console.log('Notification settings updated:', settingId);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }
}

export default FirestoreNotificationService;

