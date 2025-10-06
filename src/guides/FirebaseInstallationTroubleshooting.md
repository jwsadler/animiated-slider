# Firebase Installation Troubleshooting

## 🚨 Common Installation Issues

### Issue: "Could not resolve dependency: @react-native-firebase/database"

This usually happens when there are version mismatches or installation conflicts.

## 🔧 **Solution Steps**

### 1. **Check Your Current Firebase Version**

Look at your `package.json` to see what Firebase version you're using:

```json
{
  "dependencies": {
    "@react-native-firebase/app": "^23.1.2",
    "@react-native-firebase/auth": "^23.1.2",
    "@react-native-firebase/firestore": "^23.1.2"
  }
}
```

### 2. **Install Database Package with Matching Version**

```bash
# Use the EXACT same version as your other Firebase packages
npm install @react-native-firebase/database@23.1.2

# Or with yarn
yarn add @react-native-firebase/database@23.1.2
```

### 3. **If That Fails, Try These Steps:**

#### Option A: Clear Cache and Reinstall
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Then add database package
npm install @react-native-firebase/database@23.1.2
```

#### Option B: Use Exact Version Match
```bash
# Check what version of Firebase app you have
npm list @react-native-firebase/app

# Install database with the exact same version
npm install @react-native-firebase/database@[exact-version-from-above]
```

#### Option C: Update All Firebase Packages Together
```bash
# Update all Firebase packages to the same latest version
npm install @react-native-firebase/app@latest @react-native-firebase/database@latest @react-native-firebase/auth@latest @react-native-firebase/firestore@latest @react-native-firebase/crashlytics@latest @react-native-firebase/functions@latest
```

### 4. **Platform-Specific Setup**

After successful installation, you need to configure the database:

#### **Android Setup**
1. Make sure your `google-services.json` includes Realtime Database
2. In Firebase Console, enable Realtime Database
3. No additional Android configuration needed

#### **iOS Setup**
1. Make sure your `GoogleService-Info.plist` includes Realtime Database
2. Run `cd ios && pod install`
3. In Firebase Console, enable Realtime Database

### 5. **Verify Installation**

Create a simple test to verify it works:

```tsx
import database from '@react-native-firebase/database';

// Test Firebase Database connection
const testFirebaseDatabase = async () => {
  try {
    const ref = database().ref('/test');
    await ref.set('Hello Firebase!');
    console.log('✅ Firebase Database connected successfully!');
  } catch (error) {
    console.error('❌ Firebase Database connection failed:', error);
  }
};
```

## 🔍 **Common Causes & Solutions**

### **Version Mismatch**
- **Problem**: Different Firebase packages have different versions
- **Solution**: Use the same version for all Firebase packages

### **Cache Issues**
- **Problem**: npm/yarn cache is corrupted
- **Solution**: Clear cache and reinstall

### **Network Issues**
- **Problem**: Corporate firewall or network restrictions
- **Solution**: Try different network or use yarn instead of npm

### **React Native Version Compatibility**
- **Problem**: Firebase version incompatible with your React Native version
- **Solution**: Check [React Native Firebase compatibility table](https://rnfirebase.io/)

## 📱 **Your Specific Case**

Based on your package.json, try this exact command:

```bash
npm install @react-native-firebase/database@23.1.2
```

If that fails, try:

```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm install @react-native-firebase/database@23.1.2
```

## 🚨 **Still Having Issues?**

If you're still having problems, you can:

1. **Use the mock implementation** (works perfectly without Firebase)
2. **Check Firebase Console** - Make sure Realtime Database is enabled
3. **Verify network connectivity** - Some corporate networks block Firebase
4. **Try yarn instead of npm** - Sometimes package managers behave differently

## 💡 **Alternative: Stick with Mock for Now**

Remember, the Dynamic Labels system works perfectly with the mock implementation! You can:

- Use it immediately for development
- Test all functionality without Firebase
- Add real Firebase later when you have time to troubleshoot

The mock provides all the same features and is perfect for getting started! 🎉
