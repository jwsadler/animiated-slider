# Firebase Notifications Integration Guide

This guide explains how the notification system integrates with your **existing Firebase setup** and what additional configuration is needed.

## 🔗 Integration Overview

✅ **Your Existing Setup:**
- Firebase App initialized with App Check
- Firestore configured with `main-dev` database  
- Authentication service ready
- Multiple database instances (labels, config, messages)

✅ **What We're Adding:**
- Firebase Cloud Messaging (FCM) for push notifications
- Extended Firebase services for notifications
- Real-time notification listeners
- FCM token management

## 🚀 Installation

### 1. Install Additional Dependencies

Since you already have the core Firebase packages, you only need:

```bash
npm install @react-native-firebase/messaging @react-native-async-storage/async-storage events

# For TypeScript projects
npm install --save-dev @types/events
```

### 2. iOS Setup

1. **Add GoogleService-Info.plist**
   - Download from Firebase Console → Project Settings → iOS App
   - Add to `ios/YourApp/GoogleService-Info.plist`

2. **Update ios/Podfile**
   ```ruby
   # Add at the top
   $RNFirebaseAsStaticFramework = true
   
   # In target section
   pod 'Firebase', :modular_headers => true
   pod 'FirebaseCoreInternal', :modular_headers => true
   pod 'GoogleUtilities', :modular_headers => true
   pod 'FirebaseCore', :modular_headers => true
   ```

3. **Install pods**
   ```bash
   cd ios && pod install
   ```

4. **Update AppDelegate.m**
   ```objc
   #import <Firebase.h>
   
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
     [FIRApp configure];
     // ... rest of your code
   }
   ```

### 3. Android Setup

1. **Add google-services.json**
   - Download from Firebase Console → Project Settings → Android App
   - Add to `android/app/google-services.json`

2. **Update android/build.gradle**
   ```gradle
   buildscript {
     dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   ```

3. **Update android/app/build.gradle**
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
     implementation platform('com.google.firebase:firebase-bom:32.7.0')
   }
   ```

## 🔧 Configuration

### 1. Update Firebase Config

Edit `src/config/firebase.ts` with your Firebase project details:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};
```

### 2. Set Up Firestore Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the rules from `firestore.rules` file
3. Publish the rules

### 3. Enable Firebase Services

1. **Firestore Database**
   - Go to Firebase Console → Firestore Database
   - Create database in production mode
   - Choose your region

2. **Cloud Messaging**
   - Go to Firebase Console → Cloud Messaging
   - No additional setup required

## 📱 Usage

### 1. Initialize in Your App

```typescript
import { NotificationService } from './src/services/NotificationService.firebase';

// In your main App component or user authentication flow
const notificationService = NotificationService.getInstance();

// Initialize for a specific user
await notificationService.initialize('F3D2dgimI5ZJIKQ09gjIjKqW6F33');
```

### 2. Set Up Real-time Listeners

```typescript
// Set up listeners for real-time updates
notificationService.setupRealtimeListeners({
  onNotificationsUpdated: (notifications) => {
    console.log('Notifications updated:', notifications.length);
    // Update your UI
  },
  onUnreadCountChanged: (count) => {
    console.log('Unread count:', count);
    // Update badge count
  },
  onError: (error) => {
    console.error('Notification error:', error);
  }
});
```

### 3. Handle App State Changes

```typescript
import { AppState } from 'react-native';

// In your App component
useEffect(() => {
  const handleAppStateChange = (nextAppState: string) => {
    notificationService.handleAppStateChange(nextAppState);
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);
  return () => subscription?.remove();
}, []);
```

## 🔐 Permissions

### iOS Permissions

Add to `ios/YourApp/Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 🧪 Testing

### 1. Create Test Notification

```typescript
// Create a test notification
const notificationId = await notificationService.createTestNotification();
console.log('Test notification created:', notificationId);
```

### 2. Send Push Notification

Use Firebase Console → Cloud Messaging → Send your first message, or use the Firebase Admin SDK from your backend.

## 🏗️ Firestore Data Structure

```
/notifications/{userId}/messages/{messageId}
├── id: string
├── title: string
├── description: string
├── type: string
├── status: string
├── priority: string
├── isRead: boolean
├── createdAt: timestamp
├── updatedAt: timestamp
├── actionText?: string
├── actionUrl?: string
├── imageUrl?: string
└── metadata?: object

/users/{userId}/fcmTokens/{tokenId}
├── token: string
├── platform: string
├── deviceId: string
├── isActive: boolean
├── createdAt: timestamp
└── updatedAt: timestamp

/users/{userId}/settings/{settingId}
├── type: string
├── enabled: boolean
├── pushEnabled: boolean
├── emailEnabled: boolean
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clean and rebuild: `npx react-native clean && npx react-native run-ios`
   - Clear Metro cache: `npx react-native start --reset-cache`

2. **FCM Token Issues**
   - Check device permissions
   - Verify Firebase configuration
   - Test on physical device (not simulator)

3. **Firestore Permission Denied**
   - Verify security rules
   - Check user authentication
   - Ensure correct user ID format

### Debug Commands

```bash
# Check Firebase setup
npx react-native info

# View logs
npx react-native log-ios
npx react-native log-android
```

## 📚 Additional Resources

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 🔄 Migration from Mock Service

The new Firebase service maintains the same interface as the mock service, so existing screens should work without changes. Simply replace the import:

```typescript
// Old
import { NotificationService } from './src/services/NotificationService';

// New
import { NotificationService } from './src/services/NotificationService.firebase';
```
