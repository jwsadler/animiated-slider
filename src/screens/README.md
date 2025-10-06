# Categories Screen Integration Guide

This guide shows how to use the Interest API service with the CategoriesScreen component to load and display categories (interests) in your React Native app.

## Quick Start

### Basic Usage (Browse Mode)

```tsx
import CategoriesScreen from './screens/CategoriesScreen';
import { Interest } from './services/InterestApiService';

const App = () => {
  const handleCategorySelect = (interest: Interest) => {
    console.log('Selected:', interest.name);
    // Navigate to detail screen or handle selection
  };

  return (
    <CategoriesScreen
      onCategorySelect={handleCategorySelect}
      allowMultiSelect={false}
    />
  );
};
```

### Multi-Select with Save

```tsx
const App = () => {
  return (
    <CategoriesScreen
      allowMultiSelect={true}
      showSaveButton={true}
    />
  );
};
```

## API Integration

The CategoriesScreen automatically integrates with the InterestApiService:

### Data Loading
- **Automatic Loading**: Categories load automatically when the screen mounts
- **Pull to Refresh**: Users can pull down to refresh the data
- **Error Handling**: Shows error states with retry functionality
- **Loading States**: Displays loading indicators during API calls

### API Methods Used
```tsx
// Load categories on mount and refresh
InterestApiService.fetchInterests(onSuccess, onError, onLoading);

// Save selected categories (when showSaveButton=true)
InterestApiService.saveSelectedInterests(selected, onSuccess, onError, onLoading);
```

## Props Configuration

### CategoriesScreenProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCategorySelect` | `(interest: Interest) => void` | `undefined` | Callback when a category is selected (single-select mode) |
| `selectedCategories` | `Interest[]` | `[]` | Pre-selected categories (useful for edit mode) |
| `allowMultiSelect` | `boolean` | `false` | Enable multi-selection with checkboxes |
| `showSaveButton` | `boolean` | `false` | Show save button for multi-select mode |

## Usage Patterns

### 1. Simple Browse (Single Selection)
Perfect for navigation or category browsing:

```tsx
<CategoriesScreen
  onCategorySelect={(interest) => {
    navigation.navigate('CategoryDetail', { category: interest });
  }}
  allowMultiSelect={false}
/>
```

### 2. Multi-Select with Auto-Save
Let users select multiple categories and save automatically:

```tsx
<CategoriesScreen
  allowMultiSelect={true}
  showSaveButton={true}
/>
```

### 3. Edit Mode with Pre-selected Items
Show existing selections for editing:

```tsx
const [userInterests, setUserInterests] = useState([
  { id: '1', name: 'Photography', ... },
  { id: '3', name: 'Hiking', ... },
]);

<CategoriesScreen
  selectedCategories={userInterests}
  allowMultiSelect={true}
  showSaveButton={true}
/>
```

### 4. Parent-Managed State
Control selection state from parent component:

```tsx
const [selectedCategories, setSelectedCategories] = useState<Interest[]>([]);

const handleCategorySelect = (interest: Interest) => {
  setSelectedCategories(prev => {
    const exists = prev.some(item => item.id === interest.id);
    if (exists) {
      return prev.filter(item => item.id !== interest.id);
    } else {
      return [...prev, interest];
    }
  });
};

<CategoriesScreen
  selectedCategories={selectedCategories}
  onCategorySelect={handleCategorySelect}
  allowMultiSelect={true}
  showSaveButton={false}
/>
```

## Navigation Integration

### React Navigation Example

```tsx
// In your navigator
import CategoriesScreen from './screens/CategoriesScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ title: 'Select Categories' }}
      />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    </Stack.Navigator>
  );
}

// In CategoriesScreen usage
const CategoriesScreenWrapper = ({ navigation }) => {
  const handleCategorySelect = (interest: Interest) => {
    navigation.navigate('CategoryDetail', { 
      categoryId: interest.id,
      categoryName: interest.name 
    });
  };

  return (
    <CategoriesScreen
      onCategorySelect={handleCategorySelect}
      allowMultiSelect={false}
    />
  );
};
```

## Custom Hooks Integration

Create reusable hooks for category management:

```tsx
// Custom hook for category data
export const useCategoriesData = () => {
  const [categories, setCategories] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(() => {
    InterestApiService.fetchInterests(
      setCategories,
      setError,
      setLoading
    );
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, refetch: loadCategories };
};

// Custom hook for selection management
export const useCategorySelection = (initialSelection: Interest[] = []) => {
  const [selectedCategories, setSelectedCategories] = useState(initialSelection);

  const toggleCategory = useCallback((interest: Interest) => {
    setSelectedCategories(prev => {
      const exists = prev.some(item => item.id === interest.id);
      if (exists) {
        return prev.filter(item => item.id !== interest.id);
      } else {
        return [...prev, interest];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  return {
    selectedCategories,
    toggleCategory,
    clearSelection,
    selectionCount: selectedCategories.length,
  };
};
```

## Advanced Features

### Search Integration
Combine with the search API method:

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState<Interest[]>([]);

const handleSearch = (query: string) => {
  setSearchQuery(query);
  if (query.trim()) {
    InterestApiService.searchInterests(
      query,
      setSearchResults,
      console.error
    );
  } else {
    setSearchResults([]);
  }
};

// Use searchResults instead of all categories when search is active
```

### Offline Support
The API service works offline with static data, so the categories screen:
- ✅ Loads instantly without network dependency
- ✅ Works in airplane mode
- ✅ Provides consistent data for testing
- ✅ Simulates loading states for realistic UX

## Styling Customization

The CategoriesScreen uses a comprehensive StyleSheet that you can customize:

```tsx
// Override styles by passing custom styles or creating a themed version
const ThemedCategoriesScreen = (props) => {
  return (
    <View style={{ backgroundColor: 'your-theme-color' }}>
      <CategoriesScreen {...props} />
    </View>
  );
};
```

## Error Handling

The screen handles various error states:
- **Network errors**: Shows retry button
- **Empty data**: Graceful empty state
- **Save errors**: Alert with retry option
- **Loading errors**: User-friendly error messages

## Performance Considerations

- **Lazy Loading**: Categories load on demand
- **Efficient Re-renders**: Uses React.memo and useCallback where appropriate
- **Image Caching**: Leverages React Native's built-in image caching
- **Memory Management**: Properly cleans up state and listeners

This integration provides a complete, production-ready categories screen that seamlessly works with your Interest API service!
