# React Native SplitView Component

A flexible React Native component that allows you to display child components side by side or stacked vertically with customizable split ratios and styling.

## Features

- ✅ **Horizontal and Vertical Splits**: Display components side by side or stacked
- ✅ **Custom Split Ratios**: Define exact proportions for each section
- ✅ **Multiple Sections**: Support for 2, 3, or more sections
- ✅ **Flexible Styling**: Individual styling for each section
- ✅ **Gap Control**: Customizable spacing between sections
- ✅ **Nested Splits**: Create complex layouts by nesting SplitViews
- ✅ **TypeScript Ready**: Full PropTypes support

## Installation

Simply copy the `SplitView.js` file to your React Native project.

```bash
# If using PropTypes (recommended)
npm install prop-types
```

## Basic Usage

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import SplitView from './SplitView';

const MyComponent = () => {
  return (
    <SplitView style={{ height: 200 }}>
      <View style={{ backgroundColor: '#ff6b6b', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Left Panel</Text>
      </View>
      <View style={{ backgroundColor: '#4ecdc4', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Right Panel</Text>
      </View>
    </SplitView>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Child components to display in the split view |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the split |
| `splitRatio` | `number[]` | `[equal split]` | Array of ratios for each child (e.g., `[0.7, 0.3]`) |
| `gap` | `number` | `0` | Gap between sections in pixels |
| `style` | `ViewStyle` | `undefined` | Additional styles for the container |
| `sectionStyle` | `ViewStyle` | `undefined` | Common styles applied to each section |
| `sectionStyles` | `ViewStyle[]` | `[]` | Individual styles for each section |

## Examples

### 1. Basic 50/50 Split
```jsx
<SplitView>
  <ComponentA />
  <ComponentB />
</SplitView>
```

### 2. Custom Ratio (70/30)
```jsx
<SplitView splitRatio={[0.7, 0.3]}>
  <ComponentA />
  <ComponentB />
</SplitView>
```

### 3. Three-way Split with Gaps
```jsx
<SplitView 
  splitRatio={[0.25, 0.5, 0.25]} 
  gap={10}
>
  <ComponentA />
  <ComponentB />
  <ComponentC />
</SplitView>
```

### 4. Vertical Split
```jsx
<SplitView direction="vertical">
  <ComponentA />
  <ComponentB />
</SplitView>
```

### 5. Individual Section Styling
```jsx
<SplitView 
  sectionStyles={[
    { backgroundColor: '#ff6b6b', borderRadius: 8 },
    { backgroundColor: '#4ecdc4', borderRadius: 8 },
  ]}
>
  <ComponentA />
  <ComponentB />
</SplitView>
```

### 6. Nested Splits
```jsx
<SplitView>
  <ComponentA />
  <SplitView direction="vertical">
    <ComponentB />
    <ComponentC />
  </SplitView>
</SplitView>
```

## Advanced Usage

### Creating a Dashboard Layout
```jsx
const Dashboard = () => {
  return (
    <SplitView style={{ flex: 1 }} splitRatio={[0.3, 0.7]} gap={10}>
      {/* Sidebar */}
      <View style={{ backgroundColor: '#f8f9fa', padding: 10 }}>
        <Text>Navigation</Text>
      </View>
      
      {/* Main content area */}
      <SplitView direction="vertical" gap={10}>
        {/* Header */}
        <View style={{ backgroundColor: '#e9ecef', padding: 10, height: 60 }}>
          <Text>Header</Text>
        </View>
        
        {/* Content */}
        <SplitView splitRatio={[0.6, 0.4]} gap={10}>
          <View style={{ backgroundColor: '#fff', padding: 10 }}>
            <Text>Main Content</Text>
          </View>
          <View style={{ backgroundColor: '#f8f9fa', padding: 10 }}>
            <Text>Sidebar</Text>
          </View>
        </SplitView>
      </SplitView>
    </SplitView>
  );
};
```

## Files

- `SplitView.js` - Main component
- `SplitViewExample.js` - Comprehensive examples
- `README.md` - This documentation

## License

MIT License - feel free to use in your projects!
