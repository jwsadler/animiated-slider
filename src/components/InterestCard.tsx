import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

// Assuming Logger is imported from your logging utility
// import { Logger } from '../utils/Logger';

export interface Interest {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface InterestCardProps {
  interest: Interest;
  isSelected: boolean;
  onToggle: (interest: Interest) => void;
  disabled?: boolean;
}

export const InterestCard: React.FC<InterestCardProps> = ({
  interest,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      // Logger.userAction('select_interest', {
      //   feature: 'interests',
      //   screen: 'interests',
      // });
      onToggle(interest);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.interestCard,
        isSelected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Background image */}
      {interest.imageUrl && (
        <Image
          source={{ uri: interest.imageUrl }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      
      {/* Overlay for better text readability */}
      <View style={[
        styles.overlay,
        isSelected && styles.selectedOverlay,
        disabled && styles.disabledOverlay,
      ]} />
      
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
      
      {/* Interest content */}
      <View style={styles.interestContent}>
        <Text style={[styles.interestName, disabled && styles.disabledText]}>
          {interest.name}
        </Text>
        {interest.description && (
          <Text
            style={[
              styles.interestDescription,
              disabled && styles.disabledText,
            ]}
          >
            {interest.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  interestCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  disabledCard: {
    opacity: 0.6,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
  },
  selectedOverlay: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)', // Blue tint when selected
  },
  disabledOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay when disabled
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unchecked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1,
  },
  interestName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  interestDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default InterestCard;
