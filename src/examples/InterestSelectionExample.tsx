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
import InterestSelectionScreen from '../components/InterestSelectionScreen';
import { Interest } from '../services/InterestApiService';

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

const InterestSelectionExample: React.FC = () => {
  const [showInterestSelection, setShowInterestSelection] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [exampleType, setExampleType] = useState<'default' | 'custom' | 'limited'>('default');

  // Handle interest selection save
  const handleSaveInterests = (interests: Interest[]) => {
    log.info('💾 [Example] User selected interests:', interests.map(i => i.name));
    setSelectedInterests(interests);
    setShowInterestSelection(false);
    
    Alert.alert(
      'Interests Saved!',
      `You selected ${interests.length} interests:\n${interests.map(i => `• ${i.name}`).join('\n')}`,
      [{ text: 'OK' }]
    );
  };

  // Custom interest loader (for demonstration)
  const customInterestLoader = async (): Promise<Interest[]> => {
    log.debug('🔄 [Example] Loading custom interests...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return custom interests
    return [
      { id: 'custom1', name: 'React Native', description: 'Mobile app development with React Native' },
      { id: 'custom2', name: 'TypeScript', description: 'Typed JavaScript for better development' },
      { id: 'custom3', name: 'Node.js', description: 'Server-side JavaScript runtime' },
      { id: 'custom4', name: 'GraphQL', description: 'Query language for APIs' },
      { id: 'custom5', name: 'Docker', description: 'Containerization platform' },
      { id: 'custom6', name: 'AWS', description: 'Amazon Web Services cloud platform' },
    ];
  };

  // Show different examples
  const showExample = (type: 'default' | 'custom' | 'limited') => {
    log.debug('🎯 [Example] Showing example type:', type);
    setExampleType(type);
    setShowInterestSelection(true);
  };

  // Reset example
  const resetExample = () => {
    setSelectedInterests([]);
    setShowInterestSelection(false);
  };

  if (showInterestSelection) {
    switch (exampleType) {
      case 'default':
        return (
          <InterestSelectionScreen
            title="Select your interests"
            minSelections={2}
            onSave={handleSaveInterests}
          />
        );
      
      case 'custom':
        return (
          <InterestSelectionScreen
            title="Choose your tech stack"
            minSelections={1}
            maxSelections={4}
            onSave={handleSaveInterests}
            onLoadInterests={customInterestLoader}
          />
        );
      
      case 'limited':
        return (
          <InterestSelectionScreen
            title="Pick your top 3 interests"
            minSelections={1}
            maxSelections={3}
            onSave={handleSaveInterests}
          />
        );
      
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎯 Interest Selection Examples</Text>
        <Text style={styles.subtitle}>
          Demonstrating different configurations of the InterestSelectionScreen component
        </Text>

        {/* Example buttons */}
        <View style={styles.examplesContainer}>
          <TouchableOpacity
            style={[styles.exampleButton, styles.defaultButton]}
            onPress={() => showExample('default')}
          >
            <Text style={styles.exampleButtonTitle}>Default Example</Text>
            <Text style={styles.exampleButtonDescription}>
              • Loads from local JSON file{'\n'}
              • Minimum 2 selections{'\n'}
              • No maximum limit{'\n'}
              • Uses default API service
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exampleButton, styles.customButton]}
            onPress={() => showExample('custom')}
          >
            <Text style={styles.exampleButtonTitle}>Custom Loader Example</Text>
            <Text style={styles.exampleButtonDescription}>
              • Custom interest loader{'\n'}
              • Tech-focused interests{'\n'}
              • 1-4 selections allowed{'\n'}
              • Custom title
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exampleButton, styles.limitedButton]}
            onPress={() => showExample('limited')}
          >
            <Text style={styles.exampleButtonTitle}>Limited Selection Example</Text>
            <Text style={styles.exampleButtonDescription}>
              • Maximum 3 selections{'\n'}
              • Minimum 1 selection{'\n'}
              • Default interests{'\n'}
              • Custom title
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected interests display */}
        {selectedInterests.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>✅ Last Selected Interests:</Text>
            {selectedInterests.map(interest => (
              <View key={interest.id} style={styles.selectedInterest}>
                <Text style={styles.selectedInterestName}>{interest.name}</Text>
                {interest.description && (
                  <Text style={styles.selectedInterestDescription}>
                    {interest.description}
                  </Text>
                )}
              </View>
            ))}
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
            2. Select interests by tapping the cards (2-column grid layout)
          </Text>
          <Text style={styles.instruction}>
            3. Save button activates when minimum selections are met
          </Text>
          <Text style={styles.instruction}>
            4. Check react-native-logs output for detailed logging
          </Text>
        </View>

        {/* Component features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>🚀 Component Features</Text>
          <Text style={styles.feature}>• 2-column grid layout matching your design</Text>
          <Text style={styles.feature}>• Checkmark (✓) and empty circle (○) indicators</Text>
          <Text style={styles.feature}>• Minimum/maximum selection validation</Text>
          <Text style={styles.feature}>• Loading states with spinner</Text>
          <Text style={styles.feature}>• Error handling with alerts</Text>
          <Text style={styles.feature}>• Local JSON file loading</Text>
          <Text style={styles.feature}>• Custom API loader support</Text>
          <Text style={styles.feature}>• react-native-logs integration</Text>
          <Text style={styles.feature}>• TypeScript support</Text>
          <Text style={styles.feature}>• Responsive design</Text>
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
  customButton: {
    backgroundColor: '#F3E5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  limitedButton: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
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
  selectedInterest: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedInterestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedInterestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
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
});

export default InterestSelectionExample;
