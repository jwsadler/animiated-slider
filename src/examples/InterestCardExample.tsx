import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { InterestCard, Interest } from '../components/InterestCard';
import { InterestApiService } from '../services/InterestApiService';

const InterestCardExample: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleToggleInterest = (interest: Interest) => {
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

  const renderInterestCard = ({ item }: { item: Interest }) => (
    <View style={styles.cardWrapper}>
      <InterestCard
        interest={item}
        isSelected={isInterestSelected(item)}
        onToggle={handleToggleInterest}
        disabled={false}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading interests...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Interests</Text>
        <Text style={styles.subtitle}>
          {selectedInterests.length} selected
        </Text>
      </View>
      
      <FlatList
        data={interests}
        renderItem={renderInterestCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default InterestCardExample;
