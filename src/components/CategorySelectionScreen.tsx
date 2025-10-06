import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from 'react-native-logs';

// Configure logger
const log = logger.createLogger({
  severity: __DEV__ ? logger.consoleTransport.LogLevel.DEBUG : logger.consoleTransport.LogLevel.ERROR,
  transport: logger.consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
});

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // 2 cards per row with margins

// Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CategorySelectionScreenProps {
  title?: string;
  categories?: Category[];
  minSelections?: number;
  maxSelections?: number;
  onSave: (selectedCategories: Category[]) => void;
  onLoadCategories?: () => Promise<Category[]>;
  loading?: boolean;
  disabled?: boolean;
}

// Individual category card component
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: (category: Category) => void;
  disabled?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      log.debug('🎯 [CategoryCard] Toggling category:', category.name);
      onToggle(category);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        isSelected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Selection indicator */}
      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        ) : (
          <View style={styles.unchecked} />
        )}
      </View>

      {/* Category content */}
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryName, disabled && styles.disabledText]}>
          {category.name}
        </Text>
        {category.description && (
          <Text style={[styles.categoryDescription, disabled && styles.disabledText]}>
            {category.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main component
const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  title = 'Select your interests',
  categories: propCategories,
  minSelections = 1,
  maxSelections,
  onSave,
  onLoadCategories,
  loading: propLoading = false,
  disabled = false,
}) => {
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(propLoading);

  // Load categories on mount if loadCategories function is provided
  useEffect(() => {
    const loadCategories = async () => {
      if (onLoadCategories && categories.length === 0) {
        try {
          setLoading(true);
          log.info('📥 [CategorySelection] Loading categories from API...');
          const loadedCategories = await onLoadCategories();
          setCategories(loadedCategories);
          log.info('✅ [CategorySelection] Categories loaded successfully:', loadedCategories.length);
        } catch (error) {
          log.error('❌ [CategorySelection] Failed to load categories:', error);
          Alert.alert('Error', 'Failed to load categories. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadCategories();
  }, [onLoadCategories, categories.length]);

  // Handle category selection toggle
  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev => {
      const isCurrentlySelected = prev.some(c => c.id === category.id);
      
      if (isCurrentlySelected) {
        // Remove from selection
        const newSelection = prev.filter(c => c.id !== category.id);
        log.debug('➖ [CategorySelection] Removed category:', category.name, 'Total selected:', newSelection.length);
        return newSelection;
      } else {
        // Add to selection (check max limit)
        if (maxSelections && prev.length >= maxSelections) {
          Alert.alert('Selection Limit', `You can only select up to ${maxSelections} categories.`);
          return prev;
        }
        
        const newSelection = [...prev, category];
        log.debug('➕ [CategorySelection] Added category:', category.name, 'Total selected:', newSelection.length);
        return newSelection;
      }
    });
  };

  // Handle save button press
  const handleSave = () => {
    if (selectedCategories.length < minSelections) {
      Alert.alert(
        'Minimum Selection Required',
        `Please select at least ${minSelections} ${minSelections === 1 ? 'category' : 'categories'}.`
      );
      return;
    }

    log.info('💾 [CategorySelection] Saving selected categories:', selectedCategories.map(c => c.name));
    onSave(selectedCategories);
  };

  // Check if save button should be enabled
  const isSaveEnabled = selectedCategories.length >= minSelections && !disabled && !loading;

  // Render categories in 2-column grid
  const renderCategories = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
      const leftCategory = categories[i];
      const rightCategory = categories[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.categoryRow}>
          <CategoryCard
            category={leftCategory}
            isSelected={selectedCategories.some(c => c.id === leftCategory.id)}
            onToggle={handleCategoryToggle}
            disabled={disabled || loading}
          />
          {rightCategory && (
            <CategoryCard
              category={rightCategory}
              isSelected={selectedCategories.some(c => c.id === rightCategory.id)}
              onToggle={handleCategoryToggle}
              disabled={disabled || loading}
            />
          )}
          {!rightCategory && <View style={styles.categoryCard} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        )}

        {/* Categories grid */}
        {!loading && categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {renderCategories()}
          </View>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        )}

        {/* Selection info */}
        {categories.length > 0 && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Selected: {selectedCategories.length}
              {maxSelections && ` / ${maxSelections}`}
            </Text>
            {selectedCategories.length < minSelections && (
              <Text style={styles.minSelectionText}>
                Minimum {minSelections} required
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Save button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            isSaveEnabled ? styles.saveButtonEnabled : styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isSaveEnabled}
        >
          <Text
            style={[
              styles.saveButtonText,
              isSaveEnabled ? styles.saveButtonTextEnabled : styles.saveButtonTextDisabled,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
    color: '#333333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  categoriesContainer: {
    paddingBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  categoryCard: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  disabledCard: {
    opacity: 0.5,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  disabledText: {
    color: '#CCCCCC',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  selectionInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  selectionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  minSelectionText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  saveButtonContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonEnabled: {
    backgroundColor: '#2196F3',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextEnabled: {
    color: 'white',
  },
  saveButtonTextDisabled: {
    color: '#AAAAAA',
  },
});

export default CategorySelectionScreen;
