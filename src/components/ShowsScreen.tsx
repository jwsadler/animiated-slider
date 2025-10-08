import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from 'react-native-logs';
import Video from 'react-native-video';
import { ShowsApiService, Show } from '../services/ShowsApiService';

import {
  SearchIcon,
  ChatIcon,
  NotificationIcon,
  SoundIcon,
  MuteIcon,
  BookmarkIcon,
  EyeIcon,
  UserIcon,
} from './icons/ShowsIcons';

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

// Props interface
export interface ShowsScreenProps {
  onShowPress?: (show: Show) => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  onLoadShows?: () => Promise<Show[]>;
  onSearchShows?: (query: string) => Promise<Show[]>;
  shows?: Show[];
  loading?: boolean;
  disabled?: boolean;
}

// Individual show card component
interface ShowCardProps {
  show: Show;
  onPress: (show: Show) => void;
  disabled?: boolean;
}

const ShowCard: React.FC<ShowCardProps> = ({
  show,
  onPress,
  disabled = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handlePress = () => {
    if (!disabled) {
      log.debug('🎯 [ShowCard] Show pressed:', show.title);
      onPress(show);
    }
  };

  const handleVolumeToggle = (e: any) => {
    e.stopPropagation(); // Prevent card press
    setIsMuted(!isMuted);
    log.debug('🔊 [ShowCard] Volume toggled:', !isMuted ? 'muted' : 'unmuted');
  };

  const handleBookmarkToggle = (e: any) => {
    e.stopPropagation(); // Prevent card press
    setIsBookmarked(!isBookmarked);
    log.debug('🔖 [ShowCard] Bookmark toggled:', !isBookmarked ? 'bookmarked' : 'unbookmarked');
  };

  return (
    <TouchableOpacity
      style={[
        styles.showCard,
        disabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Background media */}
      <View style={styles.showImageContainer}>
        {show.videoUrl ? (
          <Video
            source={{ uri: show.videoUrl }}
            style={styles.showImage}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
          />
        ) : show.imageUrl ? (
          <Image 
            source={{ uri: show.imageUrl }} 
            style={styles.showImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.showImagePlaceholder} />
        )}
      </View>

      {/* Image overlay area */}
      <View style={styles.imageOverlay}>
        {/* Live indicator or scheduled time */}
        {show.isLive ? (
          <>
            {/* Live badge */}
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>live</Text>
              <Text style={styles.liveDot}>•</Text>
              <Text style={styles.viewerCountText}>{show.viewerCount}</Text>
              <EyeIcon width={12} height={12} color="#FFFFFF" />
            </View>
            {/* Volume toggle button */}
            <TouchableOpacity 
              style={[styles.volumeButton, isMuted && styles.mutedButton]} 
              onPress={handleVolumeToggle}
            >
              {isMuted ? (
                <MuteIcon width={16} height={16} color="#000000" />
              ) : (
                <SoundIcon width={16} height={16} color="#000000" />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Scheduled time badge */}
            <View style={styles.scheduledBadge}>
              <Text style={styles.scheduledText}>{show.scheduledTime}</Text>
            </View>
            {/* Bookmark toggle button */}
            <TouchableOpacity 
              style={[styles.bookmarkButton, isBookmarked && styles.bookmarkedButton]} 
              onPress={handleBookmarkToggle}
            >
              <BookmarkIcon 
                width={16} 
                height={16} 
                color="#000000"
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Show info */}
      <View style={styles.showInfo}>
        <View style={styles.showHeader}>
          {show.userIcon ? (
            <Image 
              source={{ uri: show.userIcon }} 
              style={styles.userAvatar}
            />
          ) : (
            <UserIcon width={14} height={14} color="#666666" />
          )}
          <Text style={styles.nickname}>{show.nickname}</Text>
        </View>
        <Text style={styles.showTitle} numberOfLines={2}>
          {show.title}
        </Text>
        {show.scheduledTime && (
          <Text style={styles.scheduledTime}>{show.scheduledTime}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main Shows screen component
const ShowsScreen: React.FC<ShowsScreenProps> = ({
  onShowPress,
  onChatPress,
  onNotificationPress,
  onLoadShows,
  onSearchShows,
  shows: propShows,
  loading: propLoading = false,
  disabled = false,
}) => {
  const [shows, setShows] = useState<Show[]>(propShows || []);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(propLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load shows on mount
  useEffect(() => {
    const loadShows = async () => {
      if (shows.length === 0) {
        try {
          setLoading(true);
          log.info('📥 [ShowsScreen] Loading shows...');
          
          if (onLoadShows) {
            // Use custom loader if provided
            const loadedShows = await onLoadShows();
            setShows(loadedShows);
            setFilteredShows(loadedShows);
          } else {
            // Use default API service
            ShowsApiService.fetchShows(
              (loadedShows) => {
                setShows(loadedShows);
                setFilteredShows(loadedShows);
                setLoading(false);
              },
              (error) => {
                log.error('❌ [ShowsScreen] Failed to load shows:', error);
                Alert.alert('Error', 'Failed to load shows. Please try again.');
                setLoading(false);
              },
              setLoading
            );
            return; // Early return to avoid setting loading to false twice
          }
          
          log.info('✅ [ShowsScreen] Shows loaded successfully:', shows.length);
        } catch (error) {
          log.error('❌ [ShowsScreen] Failed to load shows:', error);
          Alert.alert('Error', 'Failed to load shows. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredShows(shows);
      }
    };

    loadShows();
  }, [onLoadShows, shows.length]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is empty, show all shows
      setFilteredShows(shows);
      return;
    }

    try {
      setIsSearching(true);
      log.debug('🔍 [ShowsScreen] Searching for:', query);

      if (onSearchShows) {
        // Use custom search if provided
        const searchResults = await onSearchShows(query);
        setFilteredShows(searchResults);
      } else {
        // Use default API service
        ShowsApiService.searchShows(
          query,
          (searchResults) => {
            setFilteredShows(searchResults);
            setIsSearching(false);
          },
          (error) => {
            log.error('❌ [ShowsScreen] Search failed:', error);
            Alert.alert('Search Error', 'Failed to search shows. Please try again.');
            setIsSearching(false);
          },
          setIsSearching
        );
        return; // Early return to avoid setting isSearching to false twice
      }
    } catch (error) {
      log.error('❌ [ShowsScreen] Search failed:', error);
      Alert.alert('Search Error', 'Failed to search shows. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [shows, onSearchShows]);

  // Handle show press
  const handleShowPress = (show: Show) => {
    log.info('🎬 [ShowsScreen] Show selected:', show.title);
    onShowPress?.(show);
  };

  // Handle chat press
  const handleChatPress = () => {
    log.debug('💬 [ShowsScreen] Chat button pressed');
    onChatPress?.();
  };

  // Handle notification press
  const handleNotificationPress = () => {
    log.debug('🔔 [ShowsScreen] Notification button pressed');
    onNotificationPress?.();
  };

  // Render shows in 2-column grid
  const renderShows = () => {
    const rows = [];
    for (let i = 0; i < filteredShows.length; i += 2) {
      const leftShow = filteredShows[i];
      const rightShow = filteredShows[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.showRow}>
          <ShowCard
            show={leftShow}
            onPress={handleShowPress}
            disabled={disabled || loading}
          />
          {rightShow && (
            <ShowCard
              show={rightShow}
              onPress={handleShowPress}
              disabled={disabled || loading}
            />
          )}
          {!rightShow && <View style={styles.showCard} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with search and action buttons */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon width={16} height={16} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
            editable={!disabled && !loading}
          />
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChatPress}
          disabled={disabled}
        >
          <ChatIcon width={18} height={18} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNotificationPress}
          disabled={disabled}
        >
          <NotificationIcon width={18} height={18} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Loading indicator */}
        {(loading || isSearching) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              {isSearching ? 'Searching...' : 'Loading shows...'}
            </Text>
          </View>
        )}

        {/* Shows grid */}
        {!loading && !isSearching && filteredShows.length > 0 && (
          <View style={styles.showsContainer}>
            {renderShows()}
          </View>
        )}

        {/* Empty state */}
        {!loading && !isSearching && filteredShows.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No shows found for your search' : 'No shows available'}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => handleSearch('')}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Search results info */}
        {searchQuery && !isSearching && (
          <View style={styles.searchResultsInfo}>
            <Text style={styles.searchResultsText}>
              Found {filteredShows.length} show{filteredShows.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
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
  showsContainer: {
    paddingBottom: 20,
  },
  showRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  showCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.5,
  },
  showImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 16,
  },
  showImage: {
    width: '100%',
    height: '100%',
  },
  showImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  imageOverlay: {
    height: 120,
    position: 'relative',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  liveDot: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  viewerCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  volumeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  scheduledBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scheduledText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkedButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // Gold background when bookmarked
  },
  showInfo: {
    padding: 12,
  },
  showHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  nickname: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  showTitle: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  scheduledTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultsInfo: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default ShowsScreen;
