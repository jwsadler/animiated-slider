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
        
        {/* Centered image below title */}
        {interest.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: interest.imageUrl }}
              style={styles.interestImage}
              resizeMode="cover"
            />
          </View>
        )}
        
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
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
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
    borderColor: '#ddd',
    backgroundColor: 'transparent',
  },
  interestContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  interestImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#f0f0f0',
  },
  interestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  disabledText: {
    color: '#999',
  },
});

export default InterestCard;
