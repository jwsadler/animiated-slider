// Firebase Configuration and Initialization
import { ReactNativeFirebase } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import appCheck from '@react-native-firebase/app-check';
import { firebaseConfig } from './FirebaseConfig';
import Logger from '../../shared/utils/Logger';

let isFirebaseInitialized = false;

/**
 * Initialize Firebase with your existing configuration
 */
export const initializeFirebase = (): void => {
  if (isFirebaseInitialized) {
    Logger.info('Firebase', 'Firebase already initialized');
    return;
  }

  try {
    // Firebase is automatically initialized with your existing setup
    // This function ensures all services are ready
    Logger.info('Firebase', 'Initializing Firebase services...');
    
    // Initialize App Check if not already done
    if (appCheck().isTokenAutoRefreshEnabled === undefined) {
      // App Check configuration would be done in your main app initialization
      Logger.info('Firebase', 'App Check ready');
    }

    isFirebaseInitialized = true;
    Logger.info('Firebase', 'Firebase services initialized successfully');
  } catch (error) {
    Logger.error('Firebase', 'Failed to initialize Firebase:', error);
    throw error;
  }
};

/**
 * Get Firebase Realtime Database instance for labels/messages
 */
export const labelsDatabase = database();

/**
 * Get Firestore instance
 */
export const firestoreDb = firestore();

/**
 * Get Auth instance
 */
export const authService = auth();

/**
 * Export configuration for reference
 */
export { firebaseConfig };

