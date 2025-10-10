import React from 'react';
import { Show } from '../services/ShowsApiService';

// Show card layout variants
export type ShowCardVariant = 'grid' | 'fullWidth' | 'horizontal';

// Base props interface for all ShowCard variants
export interface ShowCardBaseProps {
  show: Show;
  onPress: (show: Show) => void;
  disabled?: boolean;
}

// Common hook for show card interactions
export const useShowCardInteractions = (show: Show, onPress: (show: Show) => void, disabled: boolean = false) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handlePress = () => {
    if (!disabled) {
      onPress(show);
    }
  };

  const handleVolumeToggle = (e: any) => {
    e.stopPropagation(); // Prevent card press
    setIsMuted(!isMuted);
  };

  const handleBookmarkToggle = (e: any) => {
    e.stopPropagation(); // Prevent card press
    setIsBookmarked(!isBookmarked);
  };

  return {
    isMuted,
    isBookmarked,
    handlePress,
    handleVolumeToggle,
    handleBookmarkToggle,
  };
};
