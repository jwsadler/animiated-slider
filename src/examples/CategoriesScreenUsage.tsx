import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CategoriesScreen from '../screens/CategoriesScreen';
import { Interest } from '../services/InterestApiService';

// Example 1: Simple Browse Mode (Single Selection)
export const BrowseCategoriesExample: React.FC = () => {
  const handleCategorySelect = (interest: Interest) => {
    Alert.alert(
      'Category Selected',
      `You selected: ${interest.name}\n\n${interest.description}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <CategoriesScreen
      onCategorySelect={handleCategorySelect}
      allowMultiSelect={false}
      showSaveButton={false}
    />
  );
};

// Example 2: Multi-Select with Save Button
export const MultiSelectCategoriesExample: React.FC = () => {
  return (
    <CategoriesScreen
      allowMultiSelect={true}
      showSaveButton={true}
    />
  );
};

// Example 3: Pre-selected Categories (Edit Mode)
export const EditCategoriesExample: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Interest[]>([
    { id: '1', name: 'Photography', description: 'Capturing moments...', imageUrl: '...' },
    { id: '3', name: 'Hiking', description: 'Exploring nature...', imageUrl: '...' },
  ]);

  return (
    <CategoriesScreen
      selectedCategories={selectedCategories}
      allowMultiSelect={true}
      showSaveButton={true}
    />
  );
};

// Example 4: Navigation Integration (React Navigation)
export const NavigationCategoriesExample: React.FC = () => {
  // This would typically be used with React Navigation
  const handleCategorySelect = (interest: Interest) => {
    // Navigate to category detail screen
    // navigation.navigate('CategoryDetail', { category: interest });
    console.log('Navigate to category:', interest.name);
  };

  return (
    <CategoriesScreen
      onCategorySelect={handleCategorySelect}
      allowMultiSelect={false}
    />
  );
};

// Example 5: Parent Component Managing State
export const ParentManagedCategoriesExample: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Interest[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  const handleCategorySelect = (interest: Interest) => {
    // Add to parent state
    setSelectedCategories(prev => {
      const exists = prev.some(item => item.id === interest.id);
      if (exists) {
        return prev.filter(item => item.id !== interest.id);
      } else {
        return [...prev, interest];
      }
    });
  };

  if (showCategories) {
    return (
      <CategoriesScreen
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        allowMultiSelect={true}
        showSaveButton={false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Categories</Text>
      <Text style={styles.count}>
        {selectedCategories.length} categories selected
      </Text>
      
      {selectedCategories.map(category => (
        <Text key={category.id} style={styles.categoryItem}>
          • {category.name}
        </Text>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCategories(true)}
      >
        <Text style={styles.buttonText}>Select Categories</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 6: Hook-based Integration
export const useCategoriesData = () => {
  const [categories, setCategories] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = () => {
    // This would use the InterestApiService directly
    // InterestApiService.fetchInterests(setCategories, setError, setLoading);
  };

  return { categories, loading, error, loadCategories };
};

// Example 7: Search Integration
export const SearchableCategoriesExample: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Interest[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Use the search method from InterestApiService
    // InterestApiService.searchInterests(query, setFilteredCategories, console.error);
  };

  return (
    <View style={styles.container}>
      {/* Add search input here */}
      <CategoriesScreen
        allowMultiSelect={true}
        showSaveButton={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  count: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  categoryItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default {
  BrowseCategoriesExample,
  MultiSelectCategoriesExample,
  EditCategoriesExample,
  NavigationCategoriesExample,
  ParentManagedCategoriesExample,
  SearchableCategoriesExample,
};
