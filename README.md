# React Native Animated Slider

A smooth, customizable animated horizontal slider button component for React Native with TypeScript support. Perfect for iOS and Android applications that need an engaging slide-to-activate interaction.

## Features

✨ **Smooth Animations**: Built with React Native Reanimated for 60fps performance  
🎯 **Haptic Feedback**: Native haptic feedback on activation (iOS & Android)  
🎨 **Fully Customizable**: Colors, sizes, styles, and animation configurations  
♿ **Accessibility**: Support for disabled states with custom opacity  
📱 **Cross-Platform**: Works seamlessly on iOS and Android  
🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions  
⚡ **Gesture Handling**: Smooth pan gesture handling with spring-back animation  

## Installation

```bash
npm install react-native-animated-slider
```

### Dependencies

This component requires the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-haptic-feedback ably
```

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

## Props

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

## How It Works

1. **Gesture Detection**: The component uses `PanGestureHandler` to detect horizontal drag gestures
2. **Animation**: `react-native-reanimated` provides smooth 60fps animations
3. **Activation**: When the thumb reaches the activation threshold (default 80%), the `onActivate` callback is triggered
4. **Haptic Feedback**: Native haptic feedback is triggered on activation (if enabled)
5. **Spring Back**: After release, the thumb smoothly springs back to the starting position

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

## Requirements

- React Native >= 0.60.0
- React >= 16.8.0
- react-native-reanimated >= 2.0.0
- react-native-gesture-handler >= 2.8.0 (uses modern Gesture API)
- react-native-haptic-feedback >= 1.0.0
- ably >= 2.12.0 (optional, for real-time features)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you like this project, please consider giving it a ⭐ on GitHub!
