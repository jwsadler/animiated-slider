import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStateDetector from './AppStateDetector';
import { useAppStateDetector, AppStateChangeEvent } from './hooks/useAppState';

// Example component that displays current app state
const AppStateDisplay: React.FC = () => {
  const [currentState, setCurrentState] = useState('unknown');
  const [previousState, setPreviousState] = useState('unknown');

  const handleAppStateChange = (event: AppStateChangeEvent) => {
    setCurrentState(event.currentState);
    setPreviousState(event.previousState);
  };

  useAppStateDetector(handleAppStateChange, true);

  return (
    <View style={styles.stateContainer}>
      <Text style={styles.sectionTitle}>📱 Current App State</Text>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Current:</Text>
        <Text style={[styles.stateValue, styles.currentState]}>{currentState}</Text>
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Previous:</Text>
        <Text style={styles.stateValue}>{previousState}</Text>
      </View>
    </View>
  );
};



// Event log display component
interface EventLogDisplayProps {
  events: string[];
  onClear: () => void;
}

const EventLogDisplay: React.FC<EventLogDisplayProps> = ({ events, onClear }) => {
  return (
    <View style={styles.logContainer}>
      <View style={styles.logHeader}>
        <Text style={styles.sectionTitle}>📋 Event Log</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.logScroll} showsVerticalScrollIndicator={false}>
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No events yet...</Text>
        ) : (
          events.map((event, index) => (
            <Text key={index} style={styles.logEvent}>
              {event}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Instructions component
const Instructions: React.FC = () => (
  <View style={styles.instructionsContainer}>
    <Text style={styles.sectionTitle}>📖 How to Test</Text>
    <View style={styles.instructionsList}>
      <Text style={styles.instruction}>
        • <Text style={styles.bold}>App States:</Text> Switch between apps, minimize, or close the app to see state changes
      </Text>
      <Text style={styles.instruction}>
        • <Text style={styles.bold}>Event Log:</Text> Watch the log below for real-time events
      </Text>
      <Text style={styles.instruction}>
        • <Text style={styles.bold}>Console:</Text> Check the console for detailed logging
      </Text>
    </View>
  </View>
);

// Main example component
const AppStateDetectorExample: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleAppStateChange = (event: AppStateChangeEvent) => {
    addEvent(`App State: ${event.previousState} → ${event.currentState}`);
    console.log('App state changed:', event);
  };

  return (
    <AppStateDetector
      enableLogging={true}
      onAppOpened={() => Alert.alert('App Opened!', 'Welcome back!')}
      onAppClosed={() => console.log('App closed - goodbye!')}
      onAppBackground={() => console.log('App moved to background')}
      onAppInactive={() => console.log('App became inactive')}
      onAppActive={() => console.log('App became active')}
      onAppStateChange={handleAppStateChange}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🔍 App State Detector</Text>
          <Text style={styles.subtitle}>
            Monitor app state changes
          </Text>
          
          <AppStateDisplay />
          <Instructions />
          <EventLogDisplay events={events} onClear={() => setEvents([])} />
        </ScrollView>
      </SafeAreaView>
    </AppStateDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  stateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stateLabel: {
    fontSize: 16,
    color: '#666666',
  },
  stateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  currentState: {
    color: '#007AFF',
    fontWeight: '600',
  },
  navigationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
  },
  activeTab: {
    transform: [{ scale: 0.95 }],
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentTabContainer: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
  },
  currentTabText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  currentTabValue: {
    fontWeight: '600',
    color: '#007AFF',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsList: {
    gap: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#1D1D1F',
  },
  logContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 200,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  logScroll: {
    flex: 1,
  },
  noEventsText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
  },
  logEvent: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default AppStateDetectorExample;
