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
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // Two cards per row with margins

const ShowCardGrid: React.FC<ShowCardBaseProps> = ({
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

const styles = StyleSheet.create({
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
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scheduledText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: 'rgba(255, 0, 0, 0.9)', // Red background when muted
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
    color: '#999999',
    fontWeight: '400',
  },
});

export default ShowCardGrid;
