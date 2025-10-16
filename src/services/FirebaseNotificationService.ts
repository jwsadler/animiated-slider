// src/services/FirebaseNotificationService.ts
import { Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  FCMToken, 
  getUserTokenPath, 
  getMessaging,
  logInfo,
  logError,
  logDebug
} from '../config/firebase-notifications';
import { getFirebaseServices } from '../config/your-existing-firebase-config'; // Update this path

export class FirebaseNotificationService {
  private static instance: FirebaseNotificationService;
  private currentUserId: string | null = null;
  private fcmToken: string | null = null;
  private unsubscribeTokenRefresh: (() => void) | null = null;
  private unsubscribeMessageListener: (() => void) | null = null;

  private constructor() {}

  static getInstance(): FirebaseNotificationService {
    if (!FirebaseNotificationService.instance) {
      FirebaseNotificationService.instance = new FirebaseNotificationService();
    }
    return FirebaseNotificationService.instance;
  }

  /**
   * Initialize FCM for the current user
   */
  async initialize(userId: string): Promise<void> {
    try {
      this.currentUserId = userId;
      
      // Request permission for notifications
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        logError('FCM: Notification permission not granted', new Error('Permission denied'));
        return;
      }

      // Get FCM token
      await this.refreshToken();

      // Set up token refresh listener
      this.setupTokenRefreshListener();

      // Set up message listeners
      this.setupMessageListeners();

      logInfo('FCM: Initialized successfully for user:', userId);
    } catch (error) {
      logError('FCM: Initialization failed', error as Error);
      throw error;
    }
  }

  /**
   * Get or refresh the FCM token
   */
  async refreshToken(): Promise<string | null> {
    try {
      if (!this.currentUserId) {
        throw new Error('User ID not set. Call initialize() first.');
      }

      const token = await messaging().getToken();
      if (token) {
        this.fcmToken = token;
        await this.saveTokenToFirestore(token);
        await AsyncStorage.setItem('fcm_token', token);
        logDebug('FCM: Token refreshed:', token.substring(0, 20) + '...');
        return token;
      }
      return null;
    } catch (error) {
      logError('FCM: Token refresh failed', error as Error);
      return null;
    }
  }

  /**
   * Save FCM token to Firestore
   */
  private async saveTokenToFirestore(token: string): Promise<void> {
    if (!this.currentUserId) return;

    try {
      const firestore = getFirebaseServices().firestore;
      
      const tokenData: Omit<FCMToken, 'id'> = {
        token,
        platform: Platform.OS as 'ios' | 'android',
        deviceId: await this.getDeviceId(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        isActive: true
      };

      const tokenPath = getUserTokenPath(this.currentUserId);
      const tokenRef = firestore.collection(tokenPath).doc(token.substring(0, 20));
      
      await tokenRef.set(tokenData);

      logInfo('FCM: Token saved to Firestore');
    } catch (error) {
      logError('FCM: Failed to save token to Firestore', error as Error);
    }
  }

  /**
   * Remove FCM token from Firestore
   */
  async removeToken(): Promise<void> {
    if (!this.currentUserId || !this.fcmToken) return;

    try {
      const firestore = getFirebaseServices().firestore;
      const tokenPath = getUserTokenPath(this.currentUserId);
      const tokenRef = firestore.collection(tokenPath).doc(this.fcmToken.substring(0, 20));
      
      await tokenRef.delete();
      await AsyncStorage.removeItem('fcm_token');
      
      this.fcmToken = null;
      logInfo('FCM: Token removed');
    } catch (error) {
      logError('FCM: Failed to remove token', error as Error);
    }
  }

  /**
   * Set up token refresh listener
   */
  private setupTokenRefreshListener(): void {
    this.unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      logDebug('FCM: Token refreshed automatically');
      this.fcmToken = token;
      await this.saveTokenToFirestore(token);
      await AsyncStorage.setItem('fcm_token', token);
    });
  }

  /**
   * Set up message listeners for foreground and background
   */
  private setupMessageListeners(): void {
    // Foreground message listener
    this.unsubscribeMessageListener = messaging().onMessage(async (remoteMessage) => {
      logInfo('FCM: Foreground message received:', remoteMessage.notification?.title || 'No title');
      await this.handleForegroundMessage(remoteMessage);
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      logInfo('FCM: Background message received:', remoteMessage.notification?.title || 'No title');
      await this.handleBackgroundMessage(remoteMessage);
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp((remoteMessage) => {
      logInfo('FCM: Notification opened app:', remoteMessage.notification?.title || 'No title');
      this.handleNotificationOpened(remoteMessage);
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          logInfo('FCM: App opened from notification:', remoteMessage.notification?.title || 'No title');
          this.handleNotificationOpened(remoteMessage);
        }
      });
  }

  /**
   * Handle foreground messages
   */
  private async handleForegroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    // You can show in-app notification or update UI
    // For now, we'll just trigger a refresh of notifications
    this.notifyNewMessage(remoteMessage);
  }

  /**
   * Handle background messages
   */
  private async handleBackgroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    // Background processing - update local storage, sync data, etc.
    console.log('Processing background message:', remoteMessage.data);
  }

  /**
   * Handle notification tap (opened app)
   */
  private handleNotificationOpened(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    // Navigate to specific screen based on notification data
    const { data } = remoteMessage;
    if (data?.notificationId) {
      // You can use navigation service to navigate to notification detail
      console.log('Navigate to notification:', data.notificationId);
    }
  }

  /**
   * Notify listeners about new messages
   */
  private notifyNewMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    // Emit event or call callback to update UI
    // This could trigger a refresh of the notifications list
    console.log('New message notification:', remoteMessage.notification?.title);
  }

  /**
   * Get device ID for tracking
   */
  private async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Failed to get device ID:', error);
      return `device_${Date.now()}`;
    }
  }

  /**
   * Clean up listeners
   */
  cleanup(): void {
    if (this.unsubscribeTokenRefresh) {
      this.unsubscribeTokenRefresh();
      this.unsubscribeTokenRefresh = null;
    }
    if (this.unsubscribeMessageListener) {
      this.unsubscribeMessageListener();
      this.unsubscribeMessageListener = null;
    }
    this.currentUserId = null;
    this.fcmToken = null;
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Check if FCM is initialized
   */
  isInitialized(): boolean {
    return this.currentUserId !== null;
  }
}

export default FirebaseNotificationService;
