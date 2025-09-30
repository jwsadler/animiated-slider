# React Native Animated Slider

A smooth, customizable animated slider button component for React Native with TypeScript support. Includes both horizontal and vertical slider variants. Perfect for iOS and Android applications that need an engaging slide-to-activate interaction.

## Features

✨ **Smooth Animations**: Built with React Native Reanimated for 60fps performance  
🎯 **Haptic Feedback**: Native haptic feedback on activation (iOS & Android)  
🎨 **Fully Customizable**: Colors, sizes, styles, and animation configurations  
♿ **Accessibility**: Support for disabled states with custom opacity  
📱 **Cross-Platform**: Works seamlessly on iOS and Android  
🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions  
⚡ **Gesture Handling**: Smooth pan gesture handling with spring-back animation  
🔄 **Dual Orientation**: Both horizontal (left-to-right) and vertical (bottom-to-top) sliders  

## Installation

```bash
npm install react-native-animated-slider
```

### Dependencies

This component requires the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-haptic-feedback react-native-linear-gradient react-native-safe-area-context @stripe/stripe-react-native ably
```

**Note**: `react-native-linear-gradient` is only required if you plan to use the gradient effect (`useGradient={true}`).

### iOS Setup

For iOS, you need to run:

```bash
cd ios && pod install
```

### Android Setup

For Android, make sure to follow the setup instructions for:
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)
- [React Native Haptic Feedback](https://github.com/mkuczera/react-native-haptic-feedback)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
- [Stripe React Native](https://github.com/stripe/stripe-react-native) (for payment integration)
- [Ably React Native SDK](https://ably.com/docs/getting-started/setup)

## Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedSlider from 'react-native-animated-slider';

const App = () => {
  const handleSliderActivation = () => {
    console.log('Slider activated!');
    // Your activation logic here
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedSlider 
          onActivate={handleSliderActivation}
          label="Slide to activate"
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
```

## Vertical Slider Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { VerticalAnimatedSlider } from 'react-native-animated-slider';

const App = () => {
  const handleSliderActivation = () => {
    console.log('Vertical slider activated!');
    // Your activation logic here
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <VerticalAnimatedSlider 
          onActivate={handleSliderActivation}
          label="SLIDE"
          height={300}
          width={60}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
```

## Advanced Usage

```tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import AnimatedSlider from 'react-native-animated-slider';

const CustomSlider = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleActivation = () => {
    Alert.alert('Success!', 'Slider was activated');
  };

  return (
    <View style={{ padding: 20 }}>
      <AnimatedSlider
        onActivate={handleActivation}
        disabled={isDisabled}
        width={300}
        height={60}
        thumbSize={50}
        trackColor="#F0F0F0"
        thumbColor="#FFFFFF"
        activeTrackColor="#4CAF50"
        borderRadius={30}
        disabledOpacity={0.5}
        hapticFeedback={true}
        activationThreshold={0.8}
        springConfig={{
          damping: 15,
          stiffness: 150,
          mass: 1,
        }}
        containerStyle={{ marginVertical: 20 }}
        trackStyle={{ backgroundColor: '#E8E8E8' }}
        thumbStyle={{ shadowOpacity: 0.3 }}
      />
    </View>
  );
};
```

## Gradient Effect

Both horizontal and vertical sliders support a beautiful gradient effect for the active track. When enabled, the active track transitions from transparent to the `activeTrackColor`.

### Horizontal Gradient Example

```tsx
<AnimatedSlider
  onActivate={() => console.log('Activated!')}
  useGradient={true}
  activeTrackColor="#6C5CE7"
  trackColor="#F5F5F5"
  thumbColor="#FFFFFF"
  label="Slide with gradient"
/>
```

### Vertical Gradient Example

```tsx
<VerticalAnimatedSlider
  onActivate={() => console.log('Activated!')}
  useGradient={true}
  activeTrackColor="#A55EEA"
  trackColor="#F8F9FA"
  thumbColor="#FFFFFF"
  height={280}
  width={60}
/>
```

The gradient creates a smooth visual transition:
- **Horizontal**: `activeTrackColor` at left → Transparent at right
- **Vertical**: `activeTrackColor` at bottom → Transparent at top

## PaymentScreen Component

The library also includes a comprehensive PaymentScreen component with Stripe integration:

```tsx
import React from 'react';
import { PaymentScreen, StripeConfig } from 'react-native-animated-slider';

const stripeConfig: StripeConfig = {
  publishableKey: 'pk_test_your_publishable_key_here',
  merchantIdentifier: 'merchant.com.yourapp', // Optional: for Apple Pay
};

const handleStripePayment = async (amount: number) => {
  const response = await fetch('https://your-backend.com/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
  });
  
  const { client_secret } = await response.json();
  return { clientSecret: client_secret };
};

const App = () => (
  <PaymentScreen
    stripeConfig={stripeConfig}
    onStripePayment={handleStripePayment}
    onPaymentPress={(method, amount) => {
      console.log('Payment:', method, amount);
    }}
    onAddPaymentMethod={() => {
      console.log('Add payment method');
    }}
  />
);
```

### Stripe Setup

For detailed Stripe integration setup, see [STRIPE_SETUP.md](./STRIPE_SETUP.md).

**Key Features:**
- 💳 **Multiple Payment Methods**: Cards, PayPal, Apple Pay, Google Pay, Stripe
- 🔒 **Secure**: PCI-compliant Stripe integration
- 📱 **Native UI**: Beautiful, responsive payment interface
- ✅ **Real-time Validation**: Card validation and error handling
- 🎯 **Test Mode**: Built-in test card support

## TopNotification Component

A flexible notification component that displays temporary messages at the top of the screen:

```tsx
import React, { useState } from 'react';
import { TopNotification } from 'react-native-animated-slider';

const App = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <TopNotification
        visible={showNotification}
        message="Payment completed successfully!"
        type="success"
        duration={3000}
        onDismiss={() => setShowNotification(false)}
      />
      
      <TouchableOpacity onPress={() => setShowNotification(true)}>
        <Text>Show Notification</Text>
      </TouchableOpacity>
    </>
  );
};
```

### Advanced Notification Management

For multiple notifications, use the notification hook and container:

```tsx
import React from 'react';
import { NotificationContainer, useNotification } from 'react-native-animated-slider';

const App = () => {
  const { notifications, hide, remove, showSuccess, showError } = useNotification();

  return (
    <>
      <NotificationContainer
        notifications={notifications}
        onDismiss={hide}
        onRemove={remove}
        maxNotifications={3}
      />
      
      <TouchableOpacity onPress={() => showSuccess('Success message!')}>
        <Text>Show Success</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => showError('Error message!')}>
        <Text>Show Error</Text>
      </TouchableOpacity>
    </>
  );
};
```

**Key Features:**
- 📱 **Top Screen Display**: Slides down from the top with smooth animations
- ⏱️ **Configurable Duration**: Auto-dismiss after specified time or manual dismiss
- 🎨 **Multiple Types**: Success, error, warning, info with default styling
- 🔧 **Customizable**: Custom icons, colors, and styling options
- 📚 **Multiple Notifications**: Stack multiple notifications with management
- ♿ **Accessibility**: Safe area and status bar aware positioning
- 🚫 **Dismissible Control**: Optional close button and tap-to-dismiss

## Props

### AnimatedSlider (Horizontal)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onActivate` | `() => void` | **Required** | Callback function called when slider is fully activated |
| `disabled` | `boolean` | `false` | Whether the slider is disabled |
| `label` | `string` | `undefined` | Label text to display on the slider |
| `labelStyle` | `TextStyle` | `undefined` | Style for the label text |
| `width` | `number` | `300` | Width of the slider container |
| `height` | `number` | `60` | Height of the slider container |
| `thumbSize` | `number` | `50` | Size of the slider thumb |
| `trackColor` | `string` | `'#E0E0E0'` | Background color of the slider track |
| `thumbColor` | `string` | `'#FFFFFF'` | Background color of the slider thumb |
| `activeTrackColor` | `string` | `'#4CAF50'` | Color of the active track (filled portion) |
| `borderRadius` | `number` | `30` | Border radius of the slider |
| `containerStyle` | `ViewStyle` | `undefined` | Custom style for the container |
| `trackStyle` | `ViewStyle` | `undefined` | Custom style for the track |
| `thumbStyle` | `ViewStyle` | `undefined` | Custom style for the thumb |
| `disabledOpacity` | `number` | `0.5` | Opacity when disabled |
| `hapticFeedback` | `boolean` | `true` | Enable haptic feedback |
| `activationThreshold` | `number` | `0.8` | Threshold percentage (0-1) at which the slider activates |
| `springConfig` | `SpringConfig` | `{ damping: 15, stiffness: 150, mass: 1 }` | Spring animation configuration |
| `useGradient` | `boolean` | `false` | Enable gradient effect for active track (activeTrackColor at left to transparent at right) |

### VerticalAnimatedSlider (Vertical)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onActivate` | `() => void` | **Required** | Callback function called when slider is fully activated |
| `disabled` | `boolean` | `false` | Whether the slider is disabled |
| `label` | `string` | `undefined` | Label text to display inside the rectangular thumb (horizontal) |
| `labelStyle` | `TextStyle` | `undefined` | Style for the label text |
| `width` | `number` | `60` | Width of the slider container |
| `height` | `number` | `300` | Height of the slider container |
| `thumbSize` | `number` | `50` | Size of the slider thumb (deprecated - use thumbWidth/thumbHeight) |
| `thumbWidth` | `number` | `50` | Width of the rectangular thumb |
| `thumbHeight` | `number` | `30` | Height of the rectangular thumb |
| `trackColor` | `string` | `'#E0E0E0'` | Background color of the slider track |
| `thumbColor` | `string` | `'#FFFFFF'` | Background color of the slider thumb |
| `activeTrackColor` | `string` | `'#4CAF50'` | Color of the active track (filled portion) |
| `borderRadius` | `number` | `30` | Border radius of the slider |
| `containerStyle` | `ViewStyle` | `undefined` | Custom style for the container |
| `trackStyle` | `ViewStyle` | `undefined` | Custom style for the track |
| `thumbStyle` | `ViewStyle` | `undefined` | Custom style for the thumb |
| `disabledOpacity` | `number` | `0.5` | Opacity when disabled |
| `hapticFeedback` | `boolean` | `true` | Enable haptic feedback |
| `activationThreshold` | `number` | `0.8` | Threshold percentage (0-1) at which the slider activates |
| `springConfig` | `SpringConfig` | `{ damping: 15, stiffness: 150, mass: 1 }` | Spring animation configuration |
| `arrowWidth` | `number` | `0.8` | Width of background arrow as percentage of track width (0.1-1.0) |
| `useGradient` | `boolean` | `false` | Enable gradient effect for active track (activeTrackColor at bottom to transparent at top) |

### SpringConfig

```tsx
interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
}
```

## Styling Examples

### Success Theme
```tsx
<AnimatedSlider
  onActivate={handleActivation}
  trackColor="#F0F8F0"
  thumbColor="#2ECC71"
  activeTrackColor="#27AE60"
  borderRadius={25}
  label="Slide to confirm"
  labelStyle={{ color: '#27AE60', fontWeight: 'bold' }}
/>
```

### Danger Theme
```tsx
<AnimatedSlider
  onActivate={handleActivation}
  trackColor="#FFE0E0"
  thumbColor="#FF6B6B"
  activeTrackColor="#FF4757"
  borderRadius={25}
  label="Swipe to delete"
  labelStyle={{ color: '#FF4757', fontSize: 14 }}
/>
```

### Compact Size
```tsx
<AnimatedSlider
  onActivate={handleActivation}
  width={200}
  height={40}
  thumbSize={30}
  borderRadius={20}
  label="→"
  labelStyle={{ fontSize: 18, color: '#666' }}
/>
```

### Vertical Slider Examples

```tsx
// Default vertical slider
<VerticalAnimatedSlider
  onActivate={handleActivation}
  label="SLIDE"
/>

// Custom styled vertical slider
<VerticalAnimatedSlider
  onActivate={handleActivation}
  width={50}
  height={250}
  thumbWidth={40}
  thumbHeight={24}
  trackColor="#FFE0E0"
  thumbColor="#FF6B6B"
  activeTrackColor="#FF4757"
  borderRadius={25}
  label="UP"
  labelStyle={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}
/>

// Compact vertical slider
<VerticalAnimatedSlider
  onActivate={handleActivation}
  width={40}
  height={200}
  thumbWidth={30}
  thumbHeight={18}
  trackColor="#E8F4FD"
  thumbColor="#3742FA"
  activeTrackColor="#5352ED"
  borderRadius={20}
  activationThreshold={0.7}
  arrowWidth={0.6} // Arrow uses 60% of track width
  label="GO"
  labelStyle={{ fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' }}
/>
```

## How It Works

1. **Gesture Detection**: The component uses `PanGestureHandler` to detect drag gestures (horizontal for AnimatedSlider, vertical for VerticalAnimatedSlider)
2. **Animation**: `react-native-reanimated` provides smooth 60fps animations
3. **Activation**: When the thumb reaches the activation threshold (default 80%), the `onActivate` callback is triggered
4. **Haptic Feedback**: Native haptic feedback is triggered on activation (if enabled)
5. **Spring Back**: After release, the thumb smoothly springs back to the starting position

### Orientation Differences
- **Horizontal Slider**: Slide from left to right to activate (circular thumb)
- **Vertical Slider**: Slide up from bottom to activate (rectangular thumb with horizontal text and background arrow)

## Real-time Integration with Ably

The slider component can be integrated with Ably for real-time features. See `example/AblyIntegrationExample.tsx` for a complete example that demonstrates:

- Broadcasting slider activations to all connected users
- Real-time synchronization across multiple devices
- Connection status monitoring
- Live statistics tracking

```tsx
import * as Ably from 'ably';

// Initialize Ably client
const ably = new Ably.Realtime({ key: 'your-ably-api-key' });
const channel = ably.channels.get('slider-activations');

// Broadcast activation
const handleSliderActivation = () => {
  channel.publish('activation', {
    timestamp: new Date().toISOString(),
    userId: 'user-123',
  });
};
```

### TopNotification

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **Required** | Whether the notification is visible |
| `message` | `string` | **Required** | The message to display |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Type of notification (affects default styling) |
| `icon` | `string` | Auto | Custom icon to display (emoji or text) |
| `duration` | `number` | `4000` | Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) |
| `dismissible` | `boolean` | `true` | Whether the notification can be manually dismissed |
| `onDismiss` | `() => void` | `undefined` | Callback when notification is dismissed |
| `customStyle` | `Partial<NotificationStyle>` | `{}` | Custom styling overrides |
| `animationDuration` | `number` | `300` | Animation duration in milliseconds |
| `showCloseButton` | `boolean` | `true` | Whether to show a close button |
| `closeButtonText` | `string` | `'✕'` | Custom close button text/icon |

### NotificationContainer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notifications` | `NotificationState[]` | **Required** | Array of notifications to display |
| `onDismiss` | `(id: string) => void` | **Required** | Callback when a notification is dismissed |
| `onRemove` | `(id: string) => void` | **Required** | Callback when a notification should be removed |
| `globalCustomStyle` | `Partial<NotificationStyle>` | `undefined` | Global custom styling overrides |
| `globalAnimationDuration` | `number` | `undefined` | Global animation duration in milliseconds |
| `maxNotifications` | `number` | `3` | Maximum number of notifications to show simultaneously |
| `notificationSpacing` | `number` | `8` | Spacing between multiple notifications |

### useNotification Hook

Returns an object with the following methods:

| Method | Type | Description |
|--------|------|-------------|
| `notifications` | `NotificationState[]` | Current array of notifications |
| `show` | `(config: NotificationConfig) => string` | Show a notification, returns notification ID |
| `hide` | `(id: string) => void` | Hide a specific notification |
| `remove` | `(id: string) => void` | Remove a specific notification |
| `clear` | `() => void` | Clear all notifications |
| `showSuccess` | `(message: string, options?) => string` | Show success notification |
| `showError` | `(message: string, options?) => string` | Show error notification |
| `showWarning` | `(message: string, options?) => string` | Show warning notification |
| `showInfo` | `(message: string, options?) => string` | Show info notification |

## BottomTabNavigation Component

A customizable bottom tab navigation component with support for disabled states and visual feedback.

### Basic Usage

```tsx
import React from 'react';
import { BottomTabNavigation, TabConfig } from 'react-native-animated-slider';
import AuctionScreen from './screens/AuctionScreen';
import PaymentScreen from './screens/PaymentScreen';

const App = () => {
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      icon: '🔨',
      component: AuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: '💳',
      component: PaymentScreen,
    },
  ];

  return (
    <BottomTabNavigation
      tabs={tabs}
      initialTab="auction"
      activeColor="#007AFF"
      inactiveColor="#8E8E93"
      backgroundColor="#FFFFFF"
      onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
    />
  );
};
```

### Disabled State

The component supports being completely disabled with visual feedback:

```tsx
<BottomTabNavigation
  tabs={tabs}
  disabled={true}
  disabledColor="#C7C7CC"
  disabledOpacity={0.6}
  onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
/>
```

### BottomTabNavigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabConfig[]` | **Required** | Array of tab configurations |
| `initialTab` | `string` | First tab ID | Initial active tab |
| `activeColor` | `string` | `#007AFF` | Color for active tab |
| `inactiveColor` | `string` | `#8E8E93` | Color for inactive tabs |
| `backgroundColor` | `string` | `#FFFFFF` | Tab bar background color |
| `tabBarHeight` | `number` | `80` | Height of the tab bar |
| `containerStyle` | `ViewStyle` | `undefined` | Custom container styling |
| `tabBarStyle` | `ViewStyle` | `undefined` | Custom tab bar styling |
| `tabStyle` | `ViewStyle` | `undefined` | Custom individual tab styling |
| `labelStyle` | `TextStyle` | `undefined` | Custom label text styling |
| `iconStyle` | `TextStyle` | `undefined` | Custom icon text styling |
| `contentStyle` | `ViewStyle` | `undefined` | Custom content area styling |
| `onTabChange` | `(tabId: string) => void` | `undefined` | Callback when tab changes |
| `disabled` | `boolean` | `false` | Disable the entire component |
| `disabledColor` | `string` | `#C7C7CC` | Color when disabled |
| `disabledOpacity` | `number` | `0.6` | Opacity when disabled |

### TabConfig Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the tab |
| `label` | `string` | Display label for the tab |
| `icon` | `string` | Icon (emoji or text) for the tab |
| `component` | `React.ComponentType` | Component to render when tab is active |

**Key Features:**
- 🚫 **Disabled State**: Complete component disable with visual feedback
- 🎨 **Customizable**: Full control over colors, styles, and appearance
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🔧 **TypeScript**: Full TypeScript support
- ♿ **Accessibility**: Proper disabled state handling
- 🎯 **Visual Feedback**: Icons and labels reflect disabled state

## Requirements

- React Native >= 0.60.0
- React >= 16.8.0
- react-native-reanimated >= 2.0.0
- react-native-gesture-handler >= 2.8.0 (uses modern Gesture API)
- react-native-haptic-feedback >= 1.0.0
- react-native-safe-area-context >= 4.0.0
- ably >= 2.12.0 (optional, for real-time features)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you like this project, please consider giving it a ⭐ on GitHub!
