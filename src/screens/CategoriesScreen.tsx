import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { InterestApiService, Interest } from '../services/InterestApiService';

interface CategoriesScreenProps {
  // Optional props for navigation or parent component integration
  onCategorySelect?: (interest: Interest) => void;
  selectedCategories?: Interest[];
  allowMultiSelect?: boolean;
  showSaveButton?: boolean;
}

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  onCategorySelect,
  selectedCategories = [],
  allowMultiSelect = false,
  showSaveButton = false,
}) => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(selectedCategories);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSelectedInterests(selectedCategories);
  }, [selectedCategories]);

  const loadCategories = () => {
    InterestApiService.fetchInterests(
      (data) => {
        setInterests(data);
        setError(null);
      },
      (errorMessage) => {
        setError(errorMessage);
        setInterests([]);
      },
      (isLoading) => {
        setLoading(isLoading);
      }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    InterestApiService.fetchInterests(
      (data) => {
        setInterests(data);
        setError(null);
        setRefreshing(false);
      },
      (errorMessage) => {
        setError(errorMessage);
        setRefreshing(false);
      }
    );
  };

  const handleCategoryPress = (interest: Interest) => {
    if (allowMultiSelect) {
      // Multi-select mode
      setSelectedInterests(prev => {
        const isSelected = prev.some(item => item.id === interest.id);
        if (isSelected) {
          return prev.filter(item => item.id !== interest.id);
        } else {
          return [...prev, interest];
        }
      });
    } else {
      // Single select mode - call parent callback
      onCategorySelect?.(interest);
    }
  };

  const isCategorySelected = (interest: Interest): boolean => {
    return selectedInterests.some(item => item.id === interest.id);
  };

  const saveSelectedCategories = () => {
    if (selectedInterests.length === 0) {
      return;
    }

    InterestApiService.saveSelectedInterests(
      selectedInterests,
      (response) => {
        // Handle successful save
        console.log('Categories saved:', response);
      },
      (errorMessage) => {
        setError(errorMessage);
      },
      (isLoading) => {
        setSaving(isLoading);
      }
    );
  };

  const renderCategory = ({ item }: { item: Interest }) => {
    const isSelected = isCategorySelected(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          isSelected && allowMultiSelect && styles.selectedCard,
        ]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
        )}
        <View style={styles.categoryContent}>
          <Text style={[
            styles.categoryName,
            isSelected && allowMultiSelect && styles.selectedText,
          ]}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={[
              styles.categoryDescription,
              isSelected && allowMultiSelect && styles.selectedDescription,
            ]}>
              {item.description}
            </Text>
          )}
        </View>
        {allowMultiSelect && (
          <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>
        {allowMultiSelect ? 'Select Categories' : 'Browse Categories'}
      </Text>
      {allowMultiSelect && (
        <Text style={styles.subtitle}>
          {selectedInterests.length} selected
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!showSaveButton || !allowMultiSelect || selectedInterests.length === 0) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={saveSelectedCategories}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Selected ({selectedInterests.length})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && interests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={interests}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0066cc',
    backgroundColor: '#f0f8ff',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  selectedText: {
    color: '#0066cc',
  },
  categoryDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  selectedDescription: {
    color: '#0066cc',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkedBox: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoriesScreen;
