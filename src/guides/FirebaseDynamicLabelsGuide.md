# Firebase Dynamic Labels Guide

This guide shows how to use Firebase Realtime Database to store and dynamically update labels and text strings in your React Native app without rebuilding.

## 🎯 Benefits

- ✅ **Update text instantly** without app store releases
- ✅ **A/B test different copy** in real-time
- ✅ **Localization support** for multiple languages
- ✅ **Real-time updates** across all app instances
- ✅ **Fallback to defaults** if Firebase is unavailable

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database**
4. Set security rules (start with test mode)

### 2. Install Firebase SDK

```bash
npm install @react-native-firebase/app @react-native-firebase/database
# or
yarn add @react-native-firebase/app @react-native-firebase/database
```

### 3. Configure Firebase

```typescript
// src/services/FirebaseConfig.ts
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export default app;
```

## 📊 Database Structure

Organize your labels in Firebase Realtime Database:

```json
{
  "labels": {
    "common": {
      "welcome": "Welcome to Our App",
      "loading": "Loading...",
      "error": "Something went wrong",
      "retry": "Try Again"
    },
    "interests": {
      "title": "Select Your Interests",
      "subtitle": "Choose what you're passionate about",
      "selectedCount": "{count} selected"
    },
    "categories": {
      "title": "Browse Categories",
      "refreshing": "Refreshing categories...",
      "pullToRefresh": "Pull to refresh"
    },
    "buttons": {
      "continue": "Continue",
      "back": "Back",
      "save": "Save"
    }
  }
}
```

## 🔧 Real Firebase Implementation

### Firebase Service

```typescript
// src/services/FirebaseDynamicLabelsService.ts
import database from '@react-native-firebase/database';

class FirebaseDynamicLabelsService {
  private labels: Labels = defaultLabels;
  private listeners: Set<LabelUpdateCallback> = new Set();
  private databaseRef = database().ref('/labels');

  async initialize(): Promise<void> {
    try {
      // Load initial data
      const snapshot = await this.databaseRef.once('value');
      if (snapshot.exists()) {
        this.labels = snapshot.val();
        this.notifyListeners();
      }

      // Start real-time listener
      this.databaseRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          console.log('🔄 Labels updated from Firebase');
          this.labels = snapshot.val();
          this.notifyListeners();
        }
      });

    } catch (error) {
      console.error('Firebase initialization failed:', error);
      // Use default labels as fallback
    }
  }

  subscribe(callback: LabelUpdateCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getLabel(path: string, interpolations?: Record<string, any>): string {
    const keys = path.split('.');
    let value: any = this.labels;
    
    for (const key of keys) {
      value = value?.[key];
      if (!value) return path; // Fallback to path
    }

    // Handle interpolations like {count}
    if (interpolations) {
      return Object.entries(interpolations).reduce((text, [key, val]) => {
        return text.replace(new RegExp(`{${key}}`, 'g'), String(val));
      }, value);
    }

    return value;
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.labels));
  }
}
```

## 🎣 React Hooks

### Basic Hook

```typescript
// src/hooks/useDynamicLabels.ts
import { useState, useEffect } from 'react';
import { getDynamicLabels } from '../services/DynamicLabelsService';

export const useDynamicLabels = () => {
  const [labels, setLabels] = useState(getDynamicLabels().getLabels());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const labelsService = getDynamicLabels();

    const initializeService = async () => {
      await labelsService.initialize();
      setIsLoading(false);
    };

    const unsubscribe = labelsService.subscribe((updatedLabels) => {
      setLabels(updatedLabels);
      setIsLoading(false);
    });

    initializeService();
    return unsubscribe;
  }, []);

  const getLabel = (path: string, interpolations?: Record<string, any>) => {
    return getDynamicLabels().getLabel(path, interpolations);
  };

  return { labels, getLabel, isLoading };
};
```

### Single Label Hook

```typescript
export const useLabel = (path: string, interpolations?: Record<string, any>) => {
  const { getLabel, isLoading } = useDynamicLabels();
  const [label, setLabel] = useState(getLabel(path, interpolations));

  useEffect(() => {
    const unsubscribe = getDynamicLabels().subscribe(() => {
      setLabel(getLabel(path, interpolations));
    });
    return unsubscribe;
  }, [path, interpolations, getLabel]);

  return { label, isLoading };
};
```

## 📱 Component Usage

### Basic Usage

```typescript
import { useDynamicLabels } from '../hooks/useDynamicLabels';

const MyComponent = () => {
  const { labels, isLoading } = useDynamicLabels();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{labels.common.welcome}</Text>
      <TouchableOpacity>
        <Text>{labels.buttons.continue}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Single Label Usage

```typescript
import { useLabel } from '../hooks/useDynamicLabels';

const WelcomeComponent = () => {
  const { label } = useLabel('common.welcome');
  
  return <Text style={styles.title}>{label}</Text>;
};
```

### With Interpolation

```typescript
const InterestsComponent = () => {
  const [selectedCount, setSelectedCount] = useState(3);
  const { label } = useLabel('interests.selectedCount', { count: selectedCount });
  
  return <Text>{label}</Text>; // "3 selected"
};
```

### Updated Categories Screen

```typescript
const CategoriesScreen = () => {
  const { getLabel, isLoading } = useDynamicLabels();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView>
      <Text style={styles.title}>{getLabel('categories.title')}</Text>
      
      <FlatList
        data={categories}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title={getLabel('categories.pullToRefresh')}
          />
        }
        ListEmptyComponent={() => (
          <Text>{getLabel('categories.emptyState')}</Text>
        )}
      />
    </SafeAreaView>
  );
};
```

## 🔄 Real-time Updates

### How It Works

1. **Firebase listener** detects database changes
2. **Service notifies** all subscribed components
3. **Components re-render** with new labels
4. **No app restart** required

### Update Labels in Firebase Console

1. Go to Firebase Console → Realtime Database
2. Navigate to `/labels/common/welcome`
3. Change value to "🎉 Welcome to Our Amazing App!"
4. **All app instances update instantly**

## 🌍 Localization Support

### Multi-language Structure

```json
{
  "labels": {
    "en": {
      "common": {
        "welcome": "Welcome to Our App"
      }
    },
    "es": {
      "common": {
        "welcome": "Bienvenido a Nuestra App"
      }
    },
    "fr": {
      "common": {
        "welcome": "Bienvenue dans Notre App"
      }
    }
  }
}
```

### Language-aware Service

```typescript
class LocalizedLabelsService {
  private currentLanguage = 'en';

  setLanguage(language: string) {
    this.currentLanguage = language;
    this.loadLabelsForLanguage(language);
  }

  getLabel(path: string): string {
    return this.getNestedValue(`${this.currentLanguage}.${path}`);
  }
}
```

## 🛡️ Security Rules

### Development Rules

```json
{
  "rules": {
    "labels": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Production Rules

```json
{
  "rules": {
    "labels": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    }
  }
}
```

## 🎯 Best Practices

### 1. Fallback Strategy

```typescript
const getLabel = (path: string, fallback?: string): string => {
  try {
    return labelsService.getLabel(path);
  } catch (error) {
    console.warn(`Label not found: ${path}`);
    return fallback || path;
  }
};
```

### 2. Caching

```typescript
// Cache labels locally for offline use
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheLabels = async (labels: Labels) => {
  await AsyncStorage.setItem('cached_labels', JSON.stringify(labels));
};

const loadCachedLabels = async (): Promise<Labels | null> => {
  const cached = await AsyncStorage.getItem('cached_labels');
  return cached ? JSON.parse(cached) : null;
};
```

### 3. Performance

```typescript
// Debounce rapid updates
const debouncedNotify = debounce(() => {
  this.notifyListeners();
}, 100);
```

### 4. Error Handling

```typescript
const labelsService = {
  initialize: async () => {
    try {
      await this.connectToFirebase();
    } catch (error) {
      console.error('Firebase connection failed, using defaults');
      this.useDefaultLabels();
    }
  }
};
```

## 🚀 Advanced Features

### A/B Testing

```json
{
  "labels": {
    "variants": {
      "welcome_a": "Welcome to Our App",
      "welcome_b": "🎉 Welcome to Our Amazing App!"
    }
  }
}
```

### Analytics Integration

```typescript
const trackLabelUsage = (labelPath: string, value: string) => {
  analytics().logEvent('label_displayed', {
    label_path: labelPath,
    label_value: value,
    timestamp: Date.now()
  });
};
```

This system gives you complete control over your app's text content without requiring app store updates! 🎉
