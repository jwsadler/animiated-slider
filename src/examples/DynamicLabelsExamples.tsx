import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDynamicLabels, useLabel, useLabels } from '../hooks/useDynamicLabels';
import { getDynamicLabels } from '../services/DynamicLabelsService';

// Example 1: Basic usage with full labels object
export const BasicDynamicLabelsExample: React.FC = () => {
  const { labels, isLoading } = useDynamicLabels();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading labels...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{labels.common.welcome}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Labels</Text>
          <Text style={styles.label}>Loading: {labels.common.loading}</Text>
          <Text style={styles.label}>Error: {labels.common.error}</Text>
          <Text style={styles.label}>Retry: {labels.common.retry}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interest Labels</Text>
          <Text style={styles.label}>Title: {labels.interests.title}</Text>
          <Text style={styles.label}>Subtitle: {labels.interests.subtitle}</Text>
          <Text style={styles.label}>Search: {labels.interests.searchPlaceholder}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Labels</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{labels.buttons.continue}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {labels.buttons.back}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Example 2: Using single label hook
export const SingleLabelExample: React.FC = () => {
  const [selectedCount, setSelectedCount] = useState(3);
  const { label: welcomeLabel } = useLabel('common.welcome');
  const { label: selectedCountLabel } = useLabel('interests.selectedCount', { count: selectedCount });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{welcomeLabel}</Text>
        <Text style={styles.subtitle}>{selectedCountLabel}</Text>
        
        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={styles.counterButton}
            onPress={() => setSelectedCount(Math.max(0, selectedCount - 1))}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.counterText}>{selectedCount}</Text>
          
          <TouchableOpacity 
            style={styles.counterButton}
            onPress={() => setSelectedCount(selectedCount + 1)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Example 3: Using multiple specific labels
export const MultipleLabelsExample: React.FC = () => {
  const { labels } = useLabels([
    'categories.title',
    'categories.refreshing',
    'categories.pullToRefresh',
    'categories.emptyState'
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{labels['categories.title']}</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Refreshing: {labels['categories.refreshing']}</Text>
          <Text style={styles.label}>Pull to Refresh: {labels['categories.pullToRefresh']}</Text>
          <Text style={styles.label}>Empty State: {labels['categories.emptyState']}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Example 4: Real-time updates demonstration
export const RealTimeUpdatesExample: React.FC = () => {
  const { labels, getLabel } = useDynamicLabels();
  const [updateCount, setUpdateCount] = useState(0);

  const simulateUpdate = () => {
    const labelsService = getDynamicLabels();
    
    // Simulate updating labels from Firebase
    labelsService.updateLabels({
      common: {
        ...labels.common,
        welcome: `🔄 Updated ${updateCount + 1} times!`,
      }
    });
    
    setUpdateCount(prev => prev + 1);
    
    Alert.alert(
      'Labels Updated!',
      'The welcome message has been updated in real-time.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{labels.common.welcome}</Text>
        <Text style={styles.subtitle}>Updates: {updateCount}</Text>
        
        <TouchableOpacity style={styles.button} onPress={simulateUpdate}>
          <Text style={styles.buttonText}>Simulate Firebase Update</Text>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 In a real app, labels would update automatically when changed in Firebase.
            This button simulates that behavior.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Example 5: Updated Categories Screen with Dynamic Labels
export const DynamicCategoriesScreen: React.FC = () => {
  const { getLabel, isLoading } = useDynamicLabels();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCount, setSelectedCount] = useState(2);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{getLabel('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{getLabel('categories.title')}</Text>
        <Text style={styles.subtitle}>
          {getLabel('interests.selectedCount', { count: selectedCount })}
        </Text>
        
        {refreshing && (
          <View style={styles.refreshingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.refreshingText}>
              {getLabel('categories.refreshing')}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.button} onPress={onRefresh}>
          <Text style={styles.buttonText}>{getLabel('categories.pullToRefresh')}</Text>
        </TouchableOpacity>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {getLabel('categories.emptyState')}
          </Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{getLabel('buttons.continue')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {getLabel('buttons.back')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  counterButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 24,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  refreshingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default {
  BasicDynamicLabelsExample,
  SingleLabelExample,
  MultipleLabelsExample,
  RealTimeUpdatesExample,
  DynamicCategoriesScreen,
};
