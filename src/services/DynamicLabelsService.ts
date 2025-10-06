// Mock Firebase Realtime Database Service for Dynamic Labels
// This simulates Firebase functionality without requiring actual Firebase setup

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

// Simulated remote labels (what would come from Firebase)
const remoteLabels: Labels = {
  common: {
    welcome: "🎉 Welcome to Our Amazing App!",
    loading: "⏳ Loading your content...",
    error: "😞 Oops! Something went wrong",
    retry: "🔄 Try Again",
    save: "💾 Save Changes",
    cancel: "❌ Cancel",
    ok: "✅ Got it!"
  },
  interests: {
    title: "🎯 Discover Your Interests",
    subtitle: "Tell us what makes you tick!",
    searchPlaceholder: "🔍 Find your passion...",
    noResults: "🤷‍♀️ No matches found",
    selectedCount: "✨ {count} interests selected"
  },
  categories: {
    title: "📂 Explore Categories",
    refreshing: "🔄 Updating categories...",
    pullToRefresh: "👆 Pull down to refresh",
    emptyState: "📭 No categories to show"
  },
  buttons: {
    continue: "➡️ Continue",
    back: "⬅️ Go Back",
    next: "▶️ Next Step",
    finish: "🏁 Complete",
    skip: "⏭️ Skip for now"
  }
};

type LabelUpdateCallback = (labels: Labels) => void;

class DynamicLabelsService {
  private static instance: DynamicLabelsService;
  private labels: Labels = defaultLabels;
  private listeners: Set<LabelUpdateCallback> = new Set();
  private isInitialized = false;

  static getInstance(): DynamicLabelsService {
    if (!DynamicLabelsService.instance) {
      DynamicLabelsService.instance = new DynamicLabelsService();
    }
    return DynamicLabelsService.instance;
  }

  // Initialize the service and start listening for updates
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔥 Initializing Dynamic Labels Service...');
    
    try {
      // Simulate initial load from Firebase
      await this.loadLabelsFromFirebase();
      
      // Start listening for real-time updates
      this.startRealtimeListener();
      
      this.isInitialized = true;
      console.log('✅ Dynamic Labels Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Dynamic Labels Service:', error);
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

  // Simulate loading labels from Firebase
  private async loadLabelsFromFirebase(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('📥 Loading labels from Firebase...');
        this.labels = { ...remoteLabels };
        this.notifyListeners();
        resolve();
      }, 1000); // Simulate network delay
    });
  }

  // Simulate real-time listener (in real Firebase, this would be database.ref().on())
  private startRealtimeListener(): void {
    console.log('👂 Starting real-time listener...');
    
    // Simulate periodic updates from Firebase
    setInterval(() => {
      // Randomly update some labels to demonstrate real-time updates
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        this.simulateRemoteUpdate();
      }
    }, 10000);
  }

  // Simulate a remote update to labels
  private simulateRemoteUpdate(): void {
    console.log('🔄 Simulating remote label update...');
    
    const updates = [
      () => {
        this.labels.common.welcome = `🎉 Welcome! Updated at ${new Date().toLocaleTimeString()}`;
      },
      () => {
        this.labels.interests.title = `🎯 Interests (Updated ${new Date().toLocaleTimeString()})`;
      },
      () => {
        this.labels.categories.title = `📂 Categories - Live Update!`;
      }
    ];

    // Apply random update
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    randomUpdate();
    
    this.notifyListeners();
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

  // Method to manually update labels (for testing)
  updateLabels(newLabels: Partial<Labels>): void {
    this.labels = { ...this.labels, ...newLabels };
    this.notifyListeners();
    console.log('🔄 Labels updated manually');
  }
}

export default DynamicLabelsService;

// Convenience function to get the service instance
export const getDynamicLabels = () => DynamicLabelsService.getInstance();
