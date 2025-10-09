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

// Alternative 1: Using react-native-config (recommended for React Native)
// import Config from 'react-native-config';

// Alternative 2: Direct environment variable access
// For React Native, you might need to use a different approach
const getEnvironmentVariable = (key: string): string | undefined => {
  // Option 1: If using react-native-config
  // return Config[key];
  
  // Option 2: If using Metro's environment variables (React Native 0.71+)
  // return process.env[key];
  
  // Option 3: Manual configuration object (fallback)
  const config = {
    FIREBASE_REALTIME_DATABASE_URL: 'https://your-project-default-rtdb.firebaseio.com/', // Replace with your URL
  };
  return config[key as keyof typeof config];
};

export interface FirebaseServices {
  app: ReactNativeFirebase.FirebaseApp;
  firestore: FirebaseFirestoreTypes.Module;
  auth: FirebaseAuthTypes.Module;
  database: FirebaseDatabaseTypes.Module;
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
    const databaseUrl = getEnvironmentVariable('FIREBASE_REALTIME_DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('FIREBASE_REALTIME_DATABASE_URL environment variable is required');
    }
    
    Logger.debug('FirebaseConfig', `Using database URL: ${databaseUrl}`);
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
      database,
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
export const database = () => getFirebaseServices().database;

// Default export
export default {
  auth,
  firestore,
  database,
  initializeFirebase,
  getFirebaseServices,
};
