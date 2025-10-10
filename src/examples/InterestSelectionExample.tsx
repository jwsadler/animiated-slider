import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { InterestApiService, Interest } from '../services/InterestApiService';

const InterestSelectionExample: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = () => {
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

  const toggleInterestSelection = (interest: Interest) => {
    setSelectedInterests(prev => {
      const isSelected = prev.some(item => item.id === interest.id);
      if (isSelected) {
        return prev.filter(item => item.id !== interest.id);
      } else {
        return [...prev, interest];
      }
    });
  };

  const isInterestSelected = (interest: Interest): boolean => {
    return selectedInterests.some(item => item.id === interest.id);
  };

  const saveSelectedInterests = () => {
    if (selectedInterests.length === 0) {
      Alert.alert('No Selection', 'Please select at least one interest before saving.');
      return;
    }

    InterestApiService.saveSelectedInterests(
      selectedInterests,
      (response) => {
        Alert.alert(
          'Success!',
          `${response.message}\n\nSaved ${response.savedCount} interest${response.savedCount !== 1 ? 's' : ''}.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Optionally clear selection after successful save
                setSelectedInterests([]);
              },
            },
          ]
        );
      },
      (errorMessage) => {
        Alert.alert('Save Failed', errorMessage, [
          { text: 'Try Again', onPress: saveSelectedInterests },
          { text: 'Cancel', style: 'cancel' },
        ]);
      },
      (isLoading) => {
        setSaving(isLoading);
      }
    );
  };

  const renderInterest = ({ item }: { item: Interest }) => {
    const selected = isInterestSelected(item);
    
    return (
      <TouchableOpacity
        style={[styles.interestCard, selected && styles.selectedCard]}
        onPress={() => toggleInterestSelection(item)}
        activeOpacity={0.7}
      >
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.name, selected && styles.selectedText]}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={[styles.description, selected && styles.selectedDescription]}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={[styles.checkbox, selected && styles.checkedBox]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading interests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInterests}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Interests</Text>
      <Text style={styles.subtitle}>
        Choose the topics that interest you most ({selectedInterests.length} selected)
      </Text>
      
      <FlatList
        data={interests}
        renderItem={renderInterest}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (selectedInterests.length === 0 || saving) && styles.disabledButton,
          ]}
          onPress={saveSelectedInterests}
          disabled={selectedInterests.length === 0 || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Selected Interests ({selectedInterests.length})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  interestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0066cc',
    backgroundColor: '#f0f8ff',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#0066cc',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#0066cc',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'white',
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
    marginTop: 8,
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

export default InterestSelectionExample;
