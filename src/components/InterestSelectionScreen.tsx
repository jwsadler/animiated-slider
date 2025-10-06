import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from 'react-native-logs';
import { InterestApiService, Interest } from '../services/InterestApiService';

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
export interface InterestSelectionScreenProps {
  title?: string;
  interests?: Interest[];
  minSelections?: number;
  maxSelections?: number;
  onSave: (selectedInterests: Interest[]) => void;
  onLoadInterests?: () => Promise<Interest[]>;
  loading?: boolean;
  disabled?: boolean;
}

// Individual interest card component
interface InterestCardProps {
  interest: Interest;
  isSelected: boolean;
  onToggle: (interest: Interest) => void;
  disabled?: boolean;
}

const InterestCard: React.FC<InterestCardProps> = ({
  interest,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      log.debug('🎯 [InterestCard] Toggling interest:', interest.name);
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
        {interest.description && (
          <Text style={[styles.interestDescription, disabled && styles.disabledText]}>
            {interest.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main component
const InterestSelectionScreen: React.FC<InterestSelectionScreenProps> = ({
  title = 'Select your interests',
  interests: propInterests,
  minSelections = 1,
  maxSelections,
  onSave,
  onLoadInterests,
  loading: propLoading = false,
  disabled = false,
}) => {
  const [interests, setInterests] = useState<Interest[]>(propInterests || []);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(propLoading);

  // Load interests on mount
  useEffect(() => {
    const loadInterests = async () => {
      if (interests.length === 0) {
        try {
          setLoading(true);
          log.info('📥 [InterestSelection] Loading interests...');
          
          if (onLoadInterests) {
            // Use custom loader if provided
            const loadedInterests = await onLoadInterests();
            setInterests(loadedInterests);
          } else {
            // Use default API service
            InterestApiService.fetchInterests(
              (loadedInterests) => {
                setInterests(loadedInterests);
                setLoading(false);
              },
              (error) => {
                log.error('❌ [InterestSelection] Failed to load interests:', error);
                Alert.alert('Error', 'Failed to load interests. Please try again.');
                setLoading(false);
              },
              setLoading
            );
            return; // Early return to avoid setting loading to false twice
          }
          
          log.info('✅ [InterestSelection] Interests loaded successfully:', interests.length);
        } catch (error) {
          log.error('❌ [InterestSelection] Failed to load interests:', error);
          Alert.alert('Error', 'Failed to load interests. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadInterests();
  }, [onLoadInterests, interests.length]);

  // Handle interest selection toggle
  const handleInterestToggle = (interest: Interest) => {
    setSelectedInterests(prev => {
      const isCurrentlySelected = prev.some(i => i.id === interest.id);
      
      if (isCurrentlySelected) {
        // Remove from selection
        const newSelection = prev.filter(i => i.id !== interest.id);
        log.debug('➖ [InterestSelection] Removed interest:', interest.name, 'Total selected:', newSelection.length);
        return newSelection;
      } else {
        // Add to selection (check max limit)
        if (maxSelections && prev.length >= maxSelections) {
          Alert.alert('Selection Limit', `You can only select up to ${maxSelections} interests.`);
          return prev;
        }
        
        const newSelection = [...prev, interest];
        log.debug('➕ [InterestSelection] Added interest:', interest.name, 'Total selected:', newSelection.length);
        return newSelection;
      }
    });
  };

  // Handle save button press
  const handleSave = () => {
    if (selectedInterests.length < minSelections) {
      Alert.alert(
        'Minimum Selection Required',
        `Please select at least ${minSelections} ${minSelections === 1 ? 'interest' : 'interests'}.`
      );
      return;
    }

    log.info('💾 [InterestSelection] Saving selected interests:', selectedInterests.map(i => i.name));
    onSave(selectedInterests);
  };

  // Check if save button should be enabled
  const isSaveEnabled = selectedInterests.length >= minSelections && !disabled && !loading;

  // Render interests in 2-column grid
  const renderInterests = () => {
    const rows = [];
    for (let i = 0; i < interests.length; i += 2) {
      const leftInterest = interests[i];
      const rightInterest = interests[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.interestRow}>
          <InterestCard
            interest={leftInterest}
            isSelected={selectedInterests.some(si => si.id === leftInterest.id)}
            onToggle={handleInterestToggle}
            disabled={disabled || loading}
          />
          {rightInterest && (
            <InterestCard
              interest={rightInterest}
              isSelected={selectedInterests.some(si => si.id === rightInterest.id)}
              onToggle={handleInterestToggle}
              disabled={disabled || loading}
            />
          )}
          {!rightInterest && <View style={styles.interestCard} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading interests...</Text>
          </View>
        )}

        {/* Interests grid */}
        {!loading && interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {renderInterests()}
          </View>
        )}

        {/* Empty state */}
        {!loading && interests.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No interests available</Text>
          </View>
        )}

        {/* Selection info */}
        {interests.length > 0 && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Selected: {selectedInterests.length}
              {maxSelections && ` / ${maxSelections}`}
            </Text>
            {selectedInterests.length < minSelections && (
              <Text style={styles.minSelectionText}>
                Minimum {minSelections} required
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Save button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            isSaveEnabled ? styles.saveButtonEnabled : styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isSaveEnabled}
        >
          <Text
            style={[
              styles.saveButtonText,
              isSaveEnabled ? styles.saveButtonTextEnabled : styles.saveButtonTextDisabled,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
    color: '#333333',
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
  interestsContainer: {
    paddingBottom: 20,
  },
  interestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  interestCard: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  disabledCard: {
    opacity: 0.5,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  interestContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  interestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  interestDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  disabledText: {
    color: '#CCCCCC',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  selectionInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  selectionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  minSelectionText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  saveButtonContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonEnabled: {
    backgroundColor: '#2196F3',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextEnabled: {
    color: 'white',
  },
  saveButtonTextDisabled: {
    color: '#AAAAAA',
  },
});

export default InterestSelectionScreen;
