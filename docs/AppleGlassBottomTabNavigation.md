# Apple Glass Bottom Tab Navigation

A beautiful, animated bottom tab navigation component with Apple's glassmorphism design language. Features smooth animations, blur effects, and modern iOS-inspired styling.

## Features

✨ **Glassmorphism Design**
- Real blur effects on iOS using `@react-native-community/blur`
- Fallback glass overlay for Android
- Transparent backgrounds with subtle borders

🎯 **Smooth Animations**
- Spring-based tab transitions
- Scale and position animations for active states
- Glow effects for active tabs
- Animated indicator that slides between tabs

🍎 **Apple Design Language**
- iOS-inspired typography and spacing
- Proper safe area handling
- Rounded corners and shadows
- Haptic feedback support (iOS)

📱 **Interactive Feedback**
- Touch scale animations
- Opacity transitions
- Icon scaling effects
- Visual feedback for all interactions

## Installation

Make sure you have the required peer dependency for blur effects:

```bash
npm install @react-native-community/blur
# or
yarn add @react-native-community/blur
```

For iOS, you'll also need to run:
```bash
cd ios && pod install
```

## Basic Usage

```tsx
import React from 'react';
import { AppleGlassBottomTabNavigation, TabConfig } from 'animated-slider';
import { HomeIcon, SearchIcon, ProfileIcon } from './icons';

const tabs: TabConfig[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
    component: HomeScreen,
  },
  {
    id: 'search',
    label: 'Search',
    icon: <SearchIcon />,
    component: SearchScreen,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <ProfileIcon />,
    component: ProfileScreen,
  },
];

const App = () => {
  return (
    <AppleGlassBottomTabNavigation
      tabs={tabs}
      initialTab="home"
      activeColor="#007AFF"
      inactiveColor="rgba(255, 255, 255, 0.6)"
      blurType="light"
      blurAmount={15}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabConfig[]` | **Required** | Array of tab configurations |
| `initialTab` | `string` | First tab ID | ID of the initially active tab |
| `activeColor` | `string` | `'#007AFF'` | Color for active tab icons and labels |
| `inactiveColor` | `string` | `'rgba(255, 255, 255, 0.6)'` | Color for inactive tab icons and labels |
| `glassColor` | `string` | `'rgba(255, 255, 255, 0.1)'` | Fallback glass color for Android |
| `tabBarHeight` | `number` | `90` | Height of the tab bar in pixels |
| `blurType` | `'light' \| 'dark' \| 'xlight'` | `'light'` | Blur effect type (iOS only) |
| `blurAmount` | `number` | `10` | Blur intensity (iOS only) |
| `onTabChange` | `(tabId: string) => void` | `undefined` | Callback when tab changes |
| `containerStyle` | `ViewStyle` | `undefined` | Style for the main container |
| `tabBarStyle` | `ViewStyle` | `undefined` | Style for the tab bar |
| `tabStyle` | `ViewStyle` | `undefined` | Style for individual tabs |
| `labelStyle` | `TextStyle` | `undefined` | Style for tab labels |
| `iconStyle` | `TextStyle` | `undefined` | Style for tab icons |
| `contentStyle` | `ViewStyle` | `undefined` | Style for the content area |
| `disabled` | `boolean` | `false` | Whether the entire navigation is disabled |
| `disabledColor` | `string` | `'rgba(255, 255, 255, 0.3)'` | Color for disabled tabs |
| `disabledOpacity` | `number` | `0.5` | Opacity for disabled tabs |
| `disabledComponent` | `React.ComponentType` | `undefined` | Component to show when navigation is disabled |

## TabConfig Interface

```tsx
interface TabConfig {
  id: string;                    // Unique identifier for the tab
  label: string;                 // Display label for the tab
  icon: React.ReactElement;      // Icon component (should accept color and size props)
  component: React.ComponentType<any>; // Screen component to render
  disabled?: boolean;            // Whether this specific tab is disabled
}
```

## Theme Variants

### Light Theme
```tsx
<AppleGlassBottomTabNavigation
  tabs={tabs}
  activeColor="#007AFF"
  inactiveColor="rgba(255, 255, 255, 0.6)"
  glassColor="rgba(255, 255, 255, 0.1)"
  blurType="light"
  blurAmount={15}
  containerStyle={{ backgroundColor: '#F2F2F7' }}
/>
```

### Dark Theme
```tsx
<AppleGlassBottomTabNavigation
  tabs={tabs}
  activeColor="#0A84FF"
  inactiveColor="rgba(255, 255, 255, 0.5)"
  glassColor="rgba(0, 0, 0, 0.3)"
  blurType="dark"
  blurAmount={20}
  containerStyle={{ backgroundColor: '#000000' }}
/>
```

## Disabled State

The component supports both global and individual tab disabled states:

### Global Disabled State
```tsx
<AppleGlassBottomTabNavigation
  tabs={tabs}
  disabled={true}
  disabledColor="rgba(255, 255, 255, 0.3)"
  disabledOpacity={0.5}
  disabledComponent={DisabledScreen}
/>
```

### Individual Tab Disabled State
```tsx
const tabs: TabConfig[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
    component: HomeScreen,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    component: SettingsScreen,
    disabled: true, // This tab will be disabled
  },
];
```

When disabled:
- Tabs become non-interactive
- Colors change to `disabledColor`
- Opacity reduces to `disabledOpacity`
- Animations are prevented
- Optional `disabledComponent` can be shown instead of active content

## Animation Details

The component includes several sophisticated animations:

1. **Tab Transitions**: Spring animations with configurable tension and friction
2. **Scale Effects**: Active tabs scale up slightly (1.1x) with smooth transitions
3. **Icon Scaling**: Active tab icons scale up (1.2x) for emphasis
4. **Glow Effects**: Subtle glow behind active tabs with opacity animations
5. **Indicator Movement**: Smooth sliding indicator that follows the active tab
6. **Touch Feedback**: Scale down on press, scale back on release

## Platform Differences

### iOS
- Uses real blur effects via `@react-native-community/blur`
- Supports haptic feedback (can be enabled in code)
- Better shadow rendering

### Android
- Uses transparent overlays to simulate glass effect
- Elevation-based shadows
- Slightly different visual appearance but maintains the same interaction patterns

## Customization Examples

### Custom Icons
```tsx
const CustomIcon = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </Svg>
);
```

### Custom Styling
```tsx
<AppleGlassBottomTabNavigation
  tabs={tabs}
  tabBarStyle={{
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  }}
  tabStyle={{
    paddingVertical: 8,
  }}
  labelStyle={{
    fontSize: 10,
    fontWeight: '600',
  }}
/>
```

## Performance Notes

- All animations use `useNativeDriver: true` for optimal performance
- Blur effects are only applied on iOS to maintain performance on Android
- Tab animations are optimized to prevent unnecessary re-renders
- Icons should be lightweight SVG components for best performance

## Accessibility

The component includes basic accessibility features:
- Proper touch targets (minimum 44pt)
- Semantic labels for screen readers
- High contrast color options
- Keyboard navigation support (when used with proper focus management)

## Troubleshooting

### Blur not working
- Ensure `@react-native-community/blur` is properly installed
- Run `pod install` for iOS
- Check that you're testing on a physical device (blur doesn't work in simulator)

### Performance issues
- Reduce `blurAmount` if experiencing lag
- Use simpler icon components
- Consider reducing the number of simultaneous animations

### Android appearance
- Adjust `glassColor` for better glass effect simulation
- Use `elevation` in `tabBarStyle` for better shadows
- Consider different color schemes for Android vs iOS
