import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { ShowCardBaseProps, useShowCardInteractions } from './ShowCardBase';
import { UserIcon, EyeIcon, MuteIcon, SoundIcon, BookmarkIcon } from '../assets/icons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_HEIGHT = 120;

const ShowCardHorizontal: React.FC<ShowCardBaseProps> = ({
  show,
  onPress,
  disabled = false,
}) => {
  const {
    isMuted,
    isBookmarked,
    handlePress,
    handleVolumeToggle,
    handleBookmarkToggle,
  } = useShowCardInteractions(show, onPress, disabled);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.showCard,
          disabled && styles.disabledCard,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
      {/* Left side - Media (25% width) */}
      <View style={styles.mediaContainer}>
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
        
        {/* Volume button overlay (only for live shows) */}
        {show.isLive && (
          <TouchableOpacity 
            style={[styles.volumeButton, isMuted && styles.mutedButton]} 
            onPress={handleVolumeToggle}
          >
            {isMuted ? (
              <MuteIcon width={14} height={14} color="#000000" />
            ) : (
              <SoundIcon width={14} height={14} color="#000000" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Right side - Content (75% width) */}
      <View style={styles.contentContainer}>
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
        
        <Text style={styles.showTitle} numberOfLines={3}>
          {show.title}
        </Text>
        
        {show.description && (
          <Text style={styles.showDescription} numberOfLines={2}>
            {show.description}
          </Text>
        )}
      </View>

      {/* Bookmark button - Top right of entire card */}
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

      {/* Live/Scheduled badge - Bottom right of entire card */}
      {show.isLive ? (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>live</Text>
          <Text style={styles.liveDot}>•</Text>
          <Text style={styles.viewerCountText}>{show.viewerCount}</Text>
          <EyeIcon width={12} height={12} color="#FFFFFF" />
        </View>
      ) : (
        <View style={styles.scheduledBadge}>
          <Text style={styles.scheduledText}>{show.scheduledTime}</Text>
        </View>
      )}
      </TouchableOpacity>
      
      {/* Full-width separator line */}
      <View style={styles.separatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: CARD_MARGIN,
  },
  showCard: {
    width: width - (CARD_MARGIN * 2), // Full width minus margins
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  separatorLine: {
    width: width, // Full screen width
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 12,
  },
  disabledCard: {
    opacity: 0.5,
  },
  mediaContainer: {
    width: '25%', // 1/4 of card width
    height: '100%',
    position: 'relative',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
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
  volumeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.9)', // Red background when muted
  },
  contentContainer: {
    flex: 1, // Takes remaining 75% width
    padding: 16,
    justifyContent: 'center',
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
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  showDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 16,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookmarkedButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // Gold background when bookmarked
  },
  liveBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginRight: 4,
  },
  liveDot: {
    color: '#FF0000',
    fontSize: 12,
    marginRight: 4,
  },
  viewerCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    marginRight: 4,
  },
  scheduledBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scheduledText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ShowCardHorizontal;
