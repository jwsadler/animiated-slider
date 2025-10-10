import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import ShowsScreen, { ShowCardVariant } from '../components/ShowsScreen';
import { Show } from '../services/ShowsApiService';

// Mock data for demonstration
const mockShows: Show[] = [
  {
    id: '1',
    title: 'Best Prices on NIKE / Adidas / Puma / Asics',
    nickname: 'nickname',
    description: 'Find the Best Prices on Top Brand Sneakers: NIKE, Adidas, Puma, and Asics.',
    viewerCount: 24,
    isLive: true,
    imageUrl: undefined,
    videoUrl: undefined,
    scheduledTime: '12:50 AM',
    userIcon: undefined,
    tags: ['sneakers', 'deals'],
    category: 'Shopping',
  },
  {
    id: '2',
    title: 'Sneaker Collection Review',
    nickname: 'sneakerhead',
    description: 'Reviewing my latest sneaker pickups and sharing where to find the best deals.',
    viewerCount: 156,
    isLive: true,
    imageUrl: undefined,
    videoUrl: undefined,
    scheduledTime: '1:15 AM',
    userIcon: undefined,
    tags: ['sneakers', 'review'],
    category: 'Fashion',
  },
  {
    id: '3',
    title: 'Jordan Release Discussion',
    nickname: 'jordanfan',
    description: 'Talking about upcoming Jordan releases and retail vs resale prices.',
    viewerCount: 89,
    isLive: false,
    imageUrl: undefined,
    videoUrl: undefined,
    scheduledTime: '11:30 PM',
    userIcon: undefined,
    tags: ['jordan', 'releases'],
    category: 'Fashion',
  },
  {
    id: '4',
    title: 'Adidas Ultraboost Comparison',
    nickname: 'runningshoes',
    description: 'Comparing different Ultraboost models and their performance features.',
    viewerCount: 67,
    isLive: true,
    imageUrl: undefined,
    videoUrl: undefined,
    scheduledTime: '2:00 AM',
    userIcon: undefined,
    tags: ['adidas', 'running'],
    category: 'Sports',
  },
];

const ShowCardVariantsExample: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<ShowCardVariant>('grid');

  const handleShowPress = (show: Show) => {
    Alert.alert('Show Selected', `You tapped on "${show.title}" by @${show.nickname}`);
  };

  const handleChatPress = () => {
    Alert.alert('Chat', 'Chat button pressed');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Notification button pressed');
  };

  const loadShows = async (): Promise<Show[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockShows);
      }, 1000);
    });
  };

  const searchShows = async (query: string): Promise<Show[]> => {
    // Simulate search API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockShows.filter(
          (show) =>
            show.title.toLowerCase().includes(query.toLowerCase()) ||
            show.nickname.toLowerCase().includes(query.toLowerCase()) ||
            show.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 500);
    });
  };

  const renderVariantSelector = () => (
    <View style={styles.variantSelector}>
      <Text style={styles.selectorTitle}>Card Layout Variant:</Text>
      <View style={styles.selectorButtons}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedVariant === 'grid' && styles.selectorButtonActive,
          ]}
          onPress={() => setSelectedVariant('grid')}
        >
          <Text
            style={[
              styles.selectorButtonText,
              selectedVariant === 'grid' && styles.selectorButtonTextActive,
            ]}
          >
            Grid (2x2)
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedVariant === 'fullWidth' && styles.selectorButtonActive,
          ]}
          onPress={() => setSelectedVariant('fullWidth')}
        >
          <Text
            style={[
              styles.selectorButtonText,
              selectedVariant === 'fullWidth' && styles.selectorButtonTextActive,
            ]}
          >
            Full Width
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedVariant === 'horizontal' && styles.selectorButtonActive,
          ]}
          onPress={() => setSelectedVariant('horizontal')}
        >
          <Text
            style={[
              styles.selectorButtonText,
              selectedVariant === 'horizontal' && styles.selectorButtonTextActive,
            ]}
          >
            Horizontal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDescription = () => {
    let description = '';
    switch (selectedVariant) {
      case 'grid':
        description = '2-column grid layout - Original design with cards arranged in a grid pattern';
        break;
      case 'fullWidth':
        description = 'Full width layout - Same aspect ratio as grid but takes up full screen width';
        break;
      case 'horizontal':
        description = 'Horizontal layout - Image/video on left (1/4 width), content on right (3/4 width)';
        break;
    }

    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 ShowCard Variants Demo</Text>
        <Text style={styles.subtitle}>Interactive showcase of different card layouts</Text>
      </View>
      
      {renderVariantSelector()}
      {renderDescription()}
      
      <View style={styles.showsContainer}>
        <ShowsScreen
          onShowPress={handleShowPress}
          onChatPress={handleChatPress}
          onNotificationPress={handleNotificationPress}
          onLoadShows={loadShows}
          onSearchShows={searchShows}
          shows={mockShows}
          variant={selectedVariant}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  variantSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  selectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    minWidth: 90,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectorButtonTextActive: {
    color: '#FFFFFF',
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  showsContainer: {
    flex: 1,
  },
});

export default ShowCardVariantsExample;
