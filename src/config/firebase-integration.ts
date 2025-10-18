// src/config/firebase-integration.ts
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
import { firestoreDb, authService, initializeFirebase } from '../services/config';
import Logger from '../../shared/utils/Logger';

/**
 * Extended Firebase Services Interface
 * Extends your existing Firebase setup with messaging capabilities
 */
export interface ExtendedFirebaseServices {
  firestore: FirebaseFirestoreTypes.Module;
  auth: FirebaseAuthTypes.Module;
  messaging: FirebaseMessagingTypes.Module;
}

let extendedServices: ExtendedFirebaseServices | null = null;

/**
 * Initialize extended Firebase services
 * This extends your existing Firebase setup with messaging support
 */
export const initializeExtendedFirebase = async (): Promise<void> => {
  if (extendedServices) {
    Logger.info('Firebase', 'Extended Firebase services already initialized');
    return;
  }

  try {
    Logger.info('Firebase', 'Initializing extended Firebase services...');

    // Initialize your existing Firebase setup first
    initializeFirebase();
    
    // Use your existing Firebase services
    const firestore = firestoreDb; // Your existing Firestore instance
    const auth = authService; // Your existing Auth instance
    
    // Add messaging service (new)
    const messagingService = messaging();

    // Create extended services object
    extendedServices = {
      firestore,
      auth,
      messaging: messagingService,
    };

    Logger.info('Firebase', 'Extended Firebase services initialized successfully');
  } catch (error) {
    Logger.error('Firebase', 'Failed to initialize extended Firebase services:', error);
    throw error;
  }
};

/**
 * Get extended Firebase services
 * Returns the extended Firebase services including messaging
 */
export const getExtendedFirebaseServices = (): ExtendedFirebaseServices => {
  if (!extendedServices) {
    throw new Error('Extended Firebase services not initialized. Call initializeExtendedFirebase() first.');
  }
  return extendedServices;
};

