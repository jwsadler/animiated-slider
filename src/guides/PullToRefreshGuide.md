# Pull-to-Refresh Guide for React Native

This guide shows you how to implement pull-to-refresh functionality in React Native using the `RefreshControl` component.

## 🚀 Quick Start

### Basic Implementation

```tsx
import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, Text } from 'react-native';

const MyScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Your API call here
    fetchData()
      .then(newData => {
        setData(newData);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* Your content here */}
    </ScrollView>
  );
};
```

## 📱 Implementation Options

### 1. With ScrollView

```tsx
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#007AFF']} // Android
      tintColor="#007AFF" // iOS
      title="Pull to refresh..." // iOS only
      titleColor="#007AFF" // iOS only
    />
  }
>
  {/* Your content */}
</ScrollView>
```

### 2. With FlatList

```tsx
<FlatList
  data={data}
  renderItem={renderItem}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#007AFF', '#34C759']} // Multiple colors for Android
      tintColor="#007AFF" // iOS
    />
  }
/>
```

### 3. With SectionList

```tsx
<SectionList
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={renderSectionHeader}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
/>
```

## ⚙️ RefreshControl Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `refreshing` | `boolean` | Both | Whether the view should be indicating an active refresh |
| `onRefresh` | `function` | Both | Called when the view starts refreshing |
| `colors` | `string[]` | Android | Colors for the refresh indicator |
| `progressBackgroundColor` | `string` | Android | Background color of the refresh indicator |
| `size` | `'default' \| 'large'` | Android | Size of the refresh indicator |
| `tintColor` | `string` | iOS | Color of the refresh indicator |
| `title` | `string` | iOS | Title displayed under the refresh indicator |
| `titleColor` | `string` | iOS | Color of the refresh indicator title |

## 🎨 Styling Examples

### Custom Colors

```tsx
<RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  // Android
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
  progressBackgroundColor="#f0f0f0"
  // iOS
  tintColor="#FF6B6B"
  title="Refreshing data..."
  titleColor="#666"
/>
```

### Dark Theme

```tsx
<RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  // Android
  colors={['#FF6B6B']}
  progressBackgroundColor="#333"
  // iOS
  tintColor="#FF6B6B"
  title="Pull to refresh"
  titleColor="#fff"
/>
```

## 🔄 Common Patterns

### 1. API Integration

```tsx
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  try {
    const response = await fetch('/api/data');
    const newData = await response.json();
    setData(newData);
  } catch (error) {
    console.error('Refresh failed:', error);
    // Handle error (show toast, etc.)
  } finally {
    setRefreshing(false);
  }
}, []);
```

### 2. With Error Handling

```tsx
const [error, setError] = useState(null);

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  setError(null);
  
  try {
    const newData = await fetchData();
    setData(newData);
  } catch (err) {
    setError(err.message);
  } finally {
    setRefreshing(false);
  }
}, []);

// Show error state with pull-to-refresh
if (error && data.length === 0) {
  return (
    <ScrollView
      contentContainerStyle={styles.centerContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#FF3B30']}
          tintColor="#FF3B30"
          title="Pull to retry..."
        />
      }
    >
      <Text style={styles.errorText}>❌ {error}</Text>
      <Text>Pull down to retry</Text>
    </ScrollView>
  );
}
```

### 3. With Loading States

```tsx
const [initialLoading, setInitialLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

const fetchData = useCallback(async (isRefresh = false) => {
  if (isRefresh) {
    setRefreshing(true);
  } else {
    setInitialLoading(true);
  }

  try {
    const newData = await apiCall();
    setData(newData);
  } finally {
    setRefreshing(false);
    setInitialLoading(false);
  }
}, []);

// Initial loading
if (initialLoading) {
  return <LoadingSpinner />;
}

// Normal view with refresh
return (
  <FlatList
    data={data}
    renderItem={renderItem}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => fetchData(true)}
      />
    }
  />
);
```

## 🎯 Best Practices

### 1. Use useCallback for onRefresh

```tsx
// ✅ Good - prevents unnecessary re-renders
const onRefresh = useCallback(() => {
  // refresh logic
}, [dependencies]);

// ❌ Bad - creates new function on every render
const onRefresh = () => {
  // refresh logic
};
```

### 2. Handle Different Loading States

```tsx
const [refreshing, setRefreshing] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);

// Separate initial loading from refresh loading
// Show spinner for initial load, pull-to-refresh for updates
```

### 3. Provide Visual Feedback

```tsx
<RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  colors={['#007AFF']}
  tintColor="#007AFF"
  title="Updating..." // Let users know what's happening
  titleColor="#666"
/>
```

### 4. Error Recovery

```tsx
// Allow users to retry failed requests via pull-to-refresh
if (error) {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title="Pull to retry..."
        />
      }
    >
      <ErrorMessage error={error} />
    </ScrollView>
  );
}
```

## 🔧 Integration with Your CategoriesScreen

Here's how to add pull-to-refresh to your existing CategoriesScreen:

```tsx
// In your CategoriesScreen component
const onRefresh = useCallback(() => {
  InterestApiService.fetchInterests(
    (data) => {
      setInterests(data);
      setError(null);
    },
    (errorMessage) => {
      setError(errorMessage);
    },
    (isLoading) => {
      setRefreshing(isLoading); // Use refreshing state
    }
  );
}, []);

return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={interests}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0066cc']}
          tintColor="#0066cc"
          title="Refreshing categories..."
          titleColor="#666"
        />
      }
    />
  </SafeAreaView>
);
```

## 📚 Complete Examples

Check out the `PullToRefreshExamples.tsx` file for complete working examples including:

1. **Basic ScrollView** - Simple pull-to-refresh implementation
2. **FlatList Integration** - With async data fetching
3. **Advanced Error Handling** - Retry failed requests
4. **Custom Styling** - Themed refresh indicators

These examples show real-world patterns you can use in your own screens! 🚀
