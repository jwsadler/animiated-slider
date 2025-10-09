import { getApp, ReactNativeFirebase } from '@react-native-firebase/app';
import {
  getFirestore,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { getAuth, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { 
  getDatabase, 
  FirebaseDatabaseTypes 
} from '@react-native-firebase/database';
import Logger from '../../shared/utils/Logger';

// For React Native environment variables
declare var process: {
  env: {
    FIREBASE_REALTIME_DATABASE_URL?: string;
    [key: string]: string | undefined;
  };
};

export interface FirebaseServices {
  app: ReactNativeFirebase.FirebaseApp;
  firestore: FirebaseFirestoreTypes.Module;
  auth: FirebaseAuthTypes.Module;
  database: FirebaseDatabaseTypes.Module; // Added Realtime Database
}

let firebaseServices: FirebaseServices | null = null;

/**
 * Initialize Firebase services once and reuse them
 */
export const initializeFirebase = (): FirebaseServices => {
  if (firebaseServices) {
    Logger.debug(
      'FirebaseConfig',
      'Firebase already initialized, reusing existing services',
    );
    return firebaseServices;
  }

  try {
    Logger.debug('FirebaseConfig', 'Initializing Firebase...');

    // Get Firebase app
    const app = getApp();

    // Initialize services
    const firestore = getFirestore(app, 'main-dev');
    const auth = getAuth(app);
    
    // Initialize Realtime Database with specific URL
    const databaseUrl = process.env.FIREBASE_REALTIME_DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('FIREBASE_REALTIME_DATABASE_URL environment variable is required');
    }
    const database = getDatabase(app, databaseUrl);

    Logger.debug(
      'FirebaseConfig',
      'Firebase services initialized:',
      {
        firestore: firestore.app.options,
        database: database.app.options,
      }
    );

    firebaseServices = {
      app,
      firestore,
      auth,
      database, // Added to services
    };

    Logger.debug('FirebaseConfig', 'Firebase initialized successfully');
    return firebaseServices;
  } catch (error) {
    Logger.error(
      'FirebaseConfig',
      'Firebase initialization failed:',
      error as Error,
    );
    throw new Error(`Failed to initialize Firebase: ${error}`);
  }
};

/**
 * Get Firebase services (must call initializeFirebase first)
 */
export const getFirebaseServices = (): FirebaseServices => {
  if (!firebaseServices) {
    throw new Error(
      'Firebase not initialized. Call initializeFirebase() first.',
    );
  }
  return firebaseServices;
};

// Convenience exports for individual services
export const auth = () => getFirebaseServices().auth;
export const firestore = () => getFirebaseServices().firestore;
export const database = () => getFirebaseServices().database; // Added database export

// Default export
export default {
  auth,
  firestore,
  database, // Added to default export
  initializeFirebase,
  getFirebaseServices,
};
