// Firebase Realtime Database Service for Dynamic Messages
// This uses actual Firebase Realtime Database for real-time label updates
//
// 🔥 IMPORTANT: This requires Firebase configuration and @react-native-firebase/database

import { useAuth } from '../../hooks';
import Logger from '../../shared/utils/Logger';
import { DynamicMessage } from '../../types/database';
import {
  initializeFirebase,
  labelsDatabase as messagingDatabase,
} from './config';

type MessageUpdateCallback = (messages: DynamicMessage[]) => void;
class FirebaseDynamicMessagesService {
  private auth = useAuth();

  private defaultMessages: DynamicMessage[] = [];
  private static instance: FirebaseDynamicMessagesService;
  private messages: DynamicMessage[] = this.defaultMessages;
  private listeners: Set<MessageUpdateCallback> = new Set();
  private isInitialized = false;
  private unsubscribeFirebase?: () => void;
  static getInstance(): FirebaseDynamicMessagesService {
    if (!FirebaseDynamicMessagesService.instance) {
      FirebaseDynamicMessagesService.instance =
        new FirebaseDynamicMessagesService();
    }
    return FirebaseDynamicMessagesService.instance;
  }
  // Initialize the service and start listening for updates
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    Logger.info(
      'DynamicMessages',
      'Initializing Firebase Dynamic Messages Service...',
    );

    try {
      // Initialize Firebase first
      initializeFirebase();

      // Load initial labels from Firebase
      await this.LoadMyMessagesFrmoFirebase();

      // Start listening for real-time updates
      this.startRealtimeListener();

      this.isInitialized = true;
      Logger.info(
        'DynamicMessages',
        'Firebase Dynamic Messages Service initialized',
      );
    } catch (error) {
      Logger.error(
        'DynamicMessages',
        'Failed to initialize Firebase Dynamic Messages Service:',
        error as Error,
      );
      // Use default labels on error
      this.messages = this.defaultMessages;
    }
  }
  // Get current messages
  getMessages(): DynamicMessage[] {
    return this.messages;
  }
  // Get a specific message item with optional interpolation
  getMessageItem(
    path: string,
    interpolations?: Record<string, string | number>,
  ): string {
    const keys = path.split('.');
    let value: any = this.messages;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        Logger.warn('DynamicMessages', `Message item not found: ${path}`);
        return path; // Return the path as fallback
      }
    }
    if (typeof value !== 'string') {
      Logger.warn('DynamicMessages', `Message item is not a string: ${path}`);
      return path;
    }
    // Handle interpolations like {count}
    if (interpolations) {
      return Object.entries(interpolations).reduce((text, [key, val]) => {
        return text.replace(new RegExp(`{${key}}`, 'g'), String(val));
      }, value);
    }
    return value;
  }
  // Subscribe to label updates
  subscribe(callback: MessageUpdateCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
  // Load labels from Firebase Realtime Database
  private async LoadMyMessagesFrmoFirebase(): Promise<void> {
    try {
      Logger.info('DynamicMessages', 'Loading messages from Firebase...');
      const messagingsRef = messagingDatabase().ref(
        `messaging/${this.auth.user?.id ?? ''}`,
      );
      const snapshot = await messagingsRef.once('value');
      const firebasMessages: DynamicMessage[] = snapshot.val();

      if (firebasMessages) {
        // Merge Firebase labels with defaults to ensure all required fields exist
        this.messages = this.mergeMessages(
          this.defaultMessages,
          firebasMessages,
        );
        Logger.info(
          'DynamicMessages',
          'Labels loaded from Firebase:',
          Object.keys(firebasMessages),
        );

        this.markAsDownLoaded(firebasMessages);
      } else {
        Logger.warn(
          'DynamicMessages',
          'No labels found in Firebase, initializing with defaults',
        );
        // Initialize Firebase with default labels
        await messagingsRef.set(this.defaultMessages);
        this.messages = this.defaultMessages;
      }

      this.notifyListeners();
    } catch (error) {
      Logger.error(
        'DynamicMessages',
        'Failed to load labels from Firebase:',
        error as Error,
      );
      this.messages = this.defaultMessages;
      throw error;
    }
  }
  // Start real-time listener for Firebase updates
  private startRealtimeListener(): void {
    Logger.info('DynamicMessages', 'Starting Firebase real-time listener...');

    try {
      const labelsRef = messagingDatabase().ref(
        `messaging/${this.auth.user?.id ?? ''}`,
      );

      // Listen for real-time updates
      const listener = labelsRef.on('value', snapshot => {
        const firebaseMessages = snapshot.val();
        if (firebaseMessages) {
          Logger.info(
            'DynamicMessages',
            'Received real-time messages update from Firebase',
          );
          this.messages = this.mergeMessages(
            this.defaultMessages,
            firebaseMessages,
          );
          this.notifyListeners();

          this.markAsDownLoaded(firebaseMessages);
        }
      });

      // Store unsubscribe function
      this.unsubscribeFirebase = () => {
        Logger.info('DynamicMessages', 'Unsubscribing from Firebase listener');
        labelsRef.off('value', listener);
      };
    } catch (error) {
      Logger.error(
        'DynamicMessages',
        'Failed to start Firebase listener:',
        error as Error,
      );
    }
  }

  private markAsDownLoaded(messages: DynamicMessage[]): void {
    if (!this.auth.user?.id) {
      return;
    }

    const updatedMessages = messages?.map(m => {
      if (m.status === 'new') {
        m.status = 'downloaded';
      }
      return m;
    });
    this.updateMessages(updatedMessages);
  }
  // Notify all subscribers of label changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.messages);
      } catch (error) {
        Logger.error(
          'DynamicMessages',
          'Error in label update callback:',
          error as Error,
        );
      }
    });
  }
  // Method to manually update labels in Firebase
  async updateMessages(newMessages: Partial<DynamicMessage[]>): Promise<void> {
    try {
      Logger.info('DynamicMessages', 'Updating labels in Firebase...');
      const messageRef = messagingDatabase().ref(
        `messaging/${this.auth.user?.id ?? ''}`,
      );

      // Update Firebase - this will trigger the real-time listener
      await messageRef.update(newMessages);

      Logger.info('DynamicMessages', 'Labels updated in Firebase');
    } catch (error) {
      Logger.error(
        'DynamicMessages',
        'Failed to update messages in Firebase:',
        error as Error,
      );
      // Fallback to local update
      this.messages = [...this.messages, ...newMessages].filter(
        (msg): msg is DynamicMessage => msg !== undefined,
      );
      this.notifyListeners();
    }
  }
  // Helper method to deep merge labels
  private mergeMessages(
    defaults: DynamicMessage[] | undefined,
    updates: any,
  ): DynamicMessage[] {
    const merged = JSON.parse(JSON.stringify(defaults)); // Deep clone

    // Deep merge function
    const deepMerge = (target: any, source: any) => {
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key])
        ) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    deepMerge(merged, updates);
    return merged;
  }
  // Cleanup method to unsubscribe from Firebase
  cleanup(): void {
    if (this.unsubscribeFirebase) {
      this.unsubscribeFirebase();
      this.unsubscribeFirebase = undefined;
    }
    this.listeners.clear();
    this.isInitialized = false;
    Logger.info(
      'DynamicMessages',
      'Firebase Dynamic Messages Service cleaned up',
    );
  }
}
export default FirebaseDynamicMessagesService;

export const getFirebaseDynamicMessages = () =>
  FirebaseDynamicMessagesService.getInstance();
