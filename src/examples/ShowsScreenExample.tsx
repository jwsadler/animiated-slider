import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from 'react-native-logs';
import ShowsScreen from '../components/ShowsScreen';
import { Show } from '../services/ShowsApiService';

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

const ShowsScreenExample: React.FC = () => {
  const [showShowsScreen, setShowShowsScreen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [exampleType, setExampleType] = useState<'default' | 'live-only' | 'custom'>('default');

  // Handle show selection
  const handleShowPress = (show: Show) => {
    log.info('🎬 [Example] User selected show:', show.title);
    setSelectedShow(show);
    setShowShowsScreen(false);
    
    Alert.alert(
      'Show Selected!',
      `You selected: "${show.title}" by ${show.nickname}\n\n${show.isLive ? '🔴 Currently Live' : `📅 Scheduled: ${show.scheduledTime}`}`,
      [
        { text: 'View Details', onPress: () => console.log('Navigate to show details') },
        { text: 'OK' }
      ]
    );
  };

  // Handle chat button press
  const handleChatPress = () => {
    log.debug('💬 [Example] Chat button pressed');
    Alert.alert('Chat', 'Chat functionality would open here!');
  };

  // Handle notification button press
  const handleNotificationPress = () => {
    log.debug('🔔 [Example] Notification button pressed');
    Alert.alert('Notifications', 'Notification center would open here!');
  };

  // Custom show loader for live shows only
  const customLiveShowsLoader = async (): Promise<Show[]> => {
    log.debug('🔴 [Example] Loading live shows only...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return only live shows (you could also use ShowsApiService.fetchLiveShows)
    return [
      {
        id: 'live1',
        title: 'LIVE: Flash Sale Electronics',
        nickname: 'techdeals',
        isLive: true,
        viewerCount: 89,
        scheduledTime: null,
        imageUrl: 'https://example.com/live1.jpg',
        description: 'Amazing electronics deals happening right now!',
        category: 'Electronics',
        tags: ['electronics', 'sale', 'gadgets']
      },
      {
        id: 'live2',
        title: 'LIVE: Fashion Runway Auction',
        nickname: 'fashionista',
        isLive: true,
        viewerCount: 156,
        scheduledTime: null,
        imageUrl: 'https://example.com/live2.jpg',
        description: 'Designer fashion items at incredible prices.',
        category: 'Fashion',
        tags: ['fashion', 'designer', 'clothing']
      },
      {
        id: 'live3',
        title: 'LIVE: Collectibles Bonanza',
        nickname: 'collector',
        isLive: true,
        viewerCount: 73,
        scheduledTime: null,
        imageUrl: 'https://example.com/live3.jpg',
        description: 'Rare collectibles and memorabilia auction.',
        category: 'Collectibles',
        tags: ['collectibles', 'rare', 'memorabilia']
      },
    ];
  };

  // Custom search function
  const customSearchShows = async (query: string): Promise<Show[]> => {
    log.debug('🔍 [Example] Custom search for:', query);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simple mock search results
    const mockResults: Show[] = [
      {
        id: 'search1',
        title: `Search Result: ${query} Items`,
        nickname: 'searchresult',
        isLive: Math.random() > 0.5,
        viewerCount: Math.floor(Math.random() * 100),
        scheduledTime: Math.random() > 0.5 ? 'Today, 15:00' : null,
        imageUrl: 'https://example.com/search.jpg',
        description: `Items matching your search for "${query}"`,
        category: 'Search Results',
        tags: [query.toLowerCase()]
      }
    ];
    
    return mockResults;
  };

  // Show different examples
  const showExample = (type: 'default' | 'live-only' | 'custom') => {
    log.debug('🎯 [Example] Showing example type:', type);
    setExampleType(type);
    setShowShowsScreen(true);
  };

  // Reset example
  const resetExample = () => {
    setSelectedShow(null);
    setShowShowsScreen(false);
  };

  if (showShowsScreen) {
    switch (exampleType) {
      case 'default':
        return (
          <ShowsScreen
            onShowPress={handleShowPress}
            onChatPress={handleChatPress}
            onNotificationPress={handleNotificationPress}
          />
        );
      
      case 'live-only':
        return (
          <ShowsScreen
            onShowPress={handleShowPress}
            onChatPress={handleChatPress}
            onNotificationPress={handleNotificationPress}
            onLoadShows={customLiveShowsLoader}
          />
        );
      
      case 'custom':
        return (
          <ShowsScreen
            onShowPress={handleShowPress}
            onChatPress={handleChatPress}
            onNotificationPress={handleNotificationPress}
            onSearchShows={customSearchShows}
          />
        );
      
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎬 Shows Screen Examples</Text>
        <Text style={styles.subtitle}>
          Demonstrating different configurations of the ShowsScreen component matching your design
        </Text>

        {/* Example buttons */}
        <View style={styles.examplesContainer}>
          <TouchableOpacity
            style={[styles.exampleButton, styles.defaultButton]}
            onPress={() => showExample('default')}
          >
            <Text style={styles.exampleButtonTitle}>Default Shows Screen</Text>
            <Text style={styles.exampleButtonDescription}>
              • Loads all shows from local JSON{'\n'}
              • 2-column grid layout{'\n'}
              • Live shows with sound icon{'\n'}
              • Scheduled shows with bookmark{'\n'}
              • Search functionality{'\n'}
              • Chat & notification buttons
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exampleButton, styles.liveButton]}
            onPress={() => showExample('live-only')}
          >
            <Text style={styles.exampleButtonTitle}>Live Shows Only</Text>
            <Text style={styles.exampleButtonDescription}>
              • Custom loader for live shows{'\n'}
              • Shows only currently live auctions{'\n'}
              • Sound icons and viewer counts{'\n'}
              • Real-time feel with higher viewer counts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exampleButton, styles.customButton]}
            onPress={() => showExample('custom')}
          >
            <Text style={styles.exampleButtonTitle}>Custom Search Example</Text>
            <Text style={styles.exampleButtonDescription}>
              • Default show loading{'\n'}
              • Custom search implementation{'\n'}
              • Mock search results{'\n'}
              • Demonstrates search API integration
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected show display */}
        {selectedShow && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>✅ Last Selected Show:</Text>
            <View style={styles.selectedShow}>
              <Text style={styles.selectedShowTitle}>{selectedShow.title}</Text>
              <Text style={styles.selectedShowNickname}>by {selectedShow.nickname}</Text>
              <Text style={styles.selectedShowStatus}>
                {selectedShow.isLive 
                  ? `🔴 Live • ${selectedShow.viewerCount} viewers` 
                  : `📅 ${selectedShow.scheduledTime}`
                }
              </Text>
              <Text style={styles.selectedShowDescription}>
                {selectedShow.description}
              </Text>
              <Text style={styles.selectedShowCategory}>
                Category: {selectedShow.category}
              </Text>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={resetExample}>
              <Text style={styles.resetButtonText}>Reset Example</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Usage instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📖 How to Use</Text>
          <Text style={styles.instruction}>
            1. Tap any example button above to see different configurations
          </Text>
          <Text style={styles.instruction}>
            2. Use the search bar to filter shows by title, nickname, or category
          </Text>
          <Text style={styles.instruction}>
            3. Tap show cards to select them (simulates navigation to details)
          </Text>
          <Text style={styles.instruction}>
            4. Tap chat 💬 and notification 🔔 buttons (placeholder functionality)
          </Text>
          <Text style={styles.instruction}>
            5. Check react-native-logs output for detailed logging
          </Text>
        </View>

        {/* Component features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>🚀 Component Features</Text>
          <Text style={styles.feature}>• 2-column grid layout matching your exact design</Text>
          <Text style={styles.feature}>• Live shows with sound icon 🔊 and viewer count</Text>
          <Text style={styles.feature}>• Scheduled shows with bookmark icon 🔖</Text>
          <Text style={styles.feature}>• Search functionality with real-time filtering</Text>
          <Text style={styles.feature}>• Chat and notification buttons (clickable)</Text>
          <Text style={styles.feature}>• Loading states with spinner</Text>
          <Text style={styles.feature}>• Error handling with alerts</Text>
          <Text style={styles.feature}>• Empty states for no results</Text>
          <Text style={styles.feature}>• Local JSON data loading</Text>
          <Text style={styles.feature}>• Custom API loader support</Text>
          <Text style={styles.feature}>• react-native-logs integration</Text>
          <Text style={styles.feature}>• TypeScript support throughout</Text>
          <Text style={styles.feature}>• Responsive design</Text>
        </View>

        {/* API Methods */}
        <View style={styles.apiContainer}>
          <Text style={styles.apiTitle}>🔧 Available API Methods</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.fetchShows() - Get all shows</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.searchShows(query) - Search shows</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.fetchLiveShows() - Live shows only</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.fetchScheduledShows() - Scheduled only</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.fetchShowsByCategory() - Filter by category</Text>
          <Text style={styles.apiMethod}>• ShowsApiService.fetchShowById() - Get specific show</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 22,
  },
  examplesContainer: {
    marginBottom: 32,
  },
  exampleButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultButton: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  liveButton: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  customButton: {
    backgroundColor: '#F3E5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  exampleButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  exampleButtonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  selectedShow: {
    marginBottom: 16,
  },
  selectedShowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedShowNickname: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedShowStatus: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedShowDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  selectedShowCategory: {
    fontSize: 12,
    color: '#999',
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  instruction: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
  },
  featuresContainer: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#7B1FA2',
  },
  feature: {
    fontSize: 14,
    color: '#7B1FA2',
    marginBottom: 4,
  },
  apiContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  apiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#D32F2F',
  },
  apiMethod: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default ShowsScreenExample;
