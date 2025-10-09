// Firebase Realtime Database Service for Dynamic Labels
// This uses actual Firebase Realtime Database for real-time label updates
// 
// 🔥 IMPORTANT: This requires Firebase configuration and @react-native-firebase/database
// Make sure to set FIREBASE_REALTIME_DATABASE_URL environment variable

import { database, initializeFirebase } from '../config/firebase-config';

export interface Labels {
  common: {
    welcome: string;
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    ok: string;
  };
  interests: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResults: string;
    selectedCount: string;
  };
  categories: {
    title: string;
    refreshing: string;
    pullToRefresh: string;
    emptyState: string;
  };
  buttons: {
    continue: string;
    back: string;
    next: string;
    finish: string;
    skip: string;
  };
}

// Default labels (fallback)
const defaultLabels: Labels = {
  common: {
    welcome: "Welcome to Our App",
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    save: "Save",
    cancel: "Cancel",
    ok: "OK"
  },
  interests: {
    title: "Select Your Interests",
    subtitle: "Choose what you're passionate about",
    searchPlaceholder: "Search interests...",
    noResults: "No interests found",
    selectedCount: "{count} selected"
  },
  categories: {
    title: "Browse Categories",
    refreshing: "Refreshing categories...",
    pullToRefresh: "Pull to refresh",
    emptyState: "No categories available"
  },
  buttons: {
    continue: "Continue",
    back: "Back",
    next: "Next",
    finish: "Finish",
    skip: "Skip"
  }
};

type LabelUpdateCallback = (labels: Labels) => void;

class FirebaseDynamicLabelsService {
  private static instance: FirebaseDynamicLabelsService;
  private labels: Labels = defaultLabels;
  private listeners: Set<LabelUpdateCallback> = new Set();
  private isInitialized = false;
  private unsubscribeFirebase?: () => void;

  static getInstance(): FirebaseDynamicLabelsService {
    if (!FirebaseDynamicLabelsService.instance) {
      FirebaseDynamicLabelsService.instance = new FirebaseDynamicLabelsService();
    }
    return FirebaseDynamicLabelsService.instance;
  }

  // Initialize the service and start listening for updates
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔥 Initializing Firebase Dynamic Labels Service...');
    
    try {
      // Initialize Firebase first
      initializeFirebase();
      
      // Load initial labels from Firebase
      await this.loadLabelsFromFirebase();
      
      // Start listening for real-time updates
      this.startRealtimeListener();
      
      this.isInitialized = true;
      console.log('✅ Firebase Dynamic Labels Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Dynamic Labels Service:', error);
      // Use default labels on error
      this.labels = defaultLabels;
    }
  }

  // Get current labels
  getLabels(): Labels {
    return this.labels;
  }

  // Get a specific label with optional interpolation
  getLabel(path: string, interpolations?: Record<string, string | number>): string {
    const keys = path.split('.');
    let value: any = this.labels;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        console.warn(`⚠️ Label not found: ${path}`);
        return path; // Return the path as fallback
      }
    }

    if (typeof value !== 'string') {
      console.warn(`⚠️ Label is not a string: ${path}`);
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
  subscribe(callback: LabelUpdateCallback): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Load labels from Firebase Realtime Database
  private async loadLabelsFromFirebase(): Promise<void> {
    try {
      console.log('📥 Loading labels from Firebase...');
      const labelsRef = database().ref('labels');
      const snapshot = await labelsRef.once('value');
      const firebaseLabels = snapshot.val();
      
      if (firebaseLabels) {
        // Merge Firebase labels with defaults to ensure all required fields exist
        this.labels = this.mergeLabels(defaultLabels, firebaseLabels);
        console.log('✅ Labels loaded from Firebase:', Object.keys(firebaseLabels));
      } else {
        console.log('⚠️ No labels found in Firebase, initializing with defaults');
        // Initialize Firebase with default labels
        await labelsRef.set(defaultLabels);
        this.labels = defaultLabels;
      }
      
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Failed to load labels from Firebase:', error);
      this.labels = defaultLabels;
      throw error;
    }
  }

  // Start real-time listener for Firebase updates
  private startRealtimeListener(): void {
    console.log('👂 Starting Firebase real-time listener...');
    
    try {
      const labelsRef = database().ref('labels');
      
      // Listen for real-time updates
      const listener = labelsRef.on('value', (snapshot) => {
        const firebaseLabels = snapshot.val();
        if (firebaseLabels) {
          console.log('🔄 Received real-time label update from Firebase');
          this.labels = this.mergeLabels(defaultLabels, firebaseLabels);
          this.notifyListeners();
        }
      });
      
      // Store unsubscribe function
      this.unsubscribeFirebase = () => {
        console.log('🔇 Unsubscribing from Firebase listener');
        labelsRef.off('value', listener);
      };
      
    } catch (error) {
      console.error('❌ Failed to start Firebase listener:', error);
    }
  }

  // Notify all subscribers of label changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.labels);
      } catch (error) {
        console.error('❌ Error in label update callback:', error);
      }
    });
  }

  // Method to manually update labels in Firebase
  async updateLabels(newLabels: Partial<Labels>): Promise<void> {
    try {
      console.log('🔄 Updating labels in Firebase...');
      const labelsRef = database().ref('labels');
      
      // Update Firebase - this will trigger the real-time listener
      await labelsRef.update(newLabels);
      
      console.log('✅ Labels updated in Firebase');
    } catch (error) {
      console.error('❌ Failed to update labels in Firebase:', error);
      // Fallback to local update
      this.labels = { ...this.labels, ...newLabels };
      this.notifyListeners();
    }
  }

  // Helper method to deep merge labels
  private mergeLabels(defaults: Labels, updates: any): Labels {
    const merged = JSON.parse(JSON.stringify(defaults)); // Deep clone
    
    // Deep merge function
    const deepMerge = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
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
    console.log('🧹 Firebase Dynamic Labels Service cleaned up');
  }
}

export default FirebaseDynamicLabelsService;

// Convenience function to get the service instance
export const getFirebaseDynamicLabels = () => FirebaseDynamicLabelsService.getInstance();
