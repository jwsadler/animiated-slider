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
import AppStateDetector, {
  useAppStateDetector,
  useScreenChangeDetector,
  useAppStateDetectorContext,
  AppStateChangeEvent,
  ScreenChangeEvent,
} from './AppStateDetector';

// Example screen component that uses the context
const AppStateDisplay: React.FC = () => {
  const { currentAppState, previousAppState, currentScreen, previousScreen } = useAppStateDetectorContext();

  return (
    <View style={styles.stateContainer}>
      <Text style={styles.sectionTitle}>📱 Current App State</Text>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Current:</Text>
        <Text style={[styles.stateValue, styles.currentState]}>{currentAppState}</Text>
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Previous:</Text>
        <Text style={styles.stateValue}>{previousAppState}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>🖥️ Current Screen</Text>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Current:</Text>
        <Text style={[styles.stateValue, styles.currentState]}>{currentScreen || 'None'}</Text>
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>Previous:</Text>
        <Text style={styles.stateValue}>{previousScreen || 'None'}</Text>
      </View>
    </View>
  );
};

// Example component that demonstrates screen change detection
const ScreenNavigationExample: React.FC = () => {
  const { notifyScreenChange } = useAppStateDetectorContext();
  const [currentTab, setCurrentTab] = useState('home');

  const handleTabPress = (tabName: string) => {
    setCurrentTab(tabName);
    notifyScreenChange(tabName);
  };

  const tabs = [
    { id: 'home', label: '🏠 Home', color: '#007AFF' },
    { id: 'profile', label: '👤 Profile', color: '#34C759' },
    { id: 'settings', label: '⚙️ Settings', color: '#FF9500' },
    { id: 'notifications', label: '🔔 Notifications', color: '#FF3B30' },
  ];

  return (
    <View style={styles.navigationContainer}>
      <Text style={styles.sectionTitle}>🧭 Screen Navigation Test</Text>
      <Text style={styles.description}>
        Tap the buttons below to simulate screen changes:
      </Text>
      
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              { backgroundColor: tab.color },
              currentTab === tab.id && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.currentTabContainer}>
        <Text style={styles.currentTabText}>
          Current Tab: <Text style={styles.currentTabValue}>{currentTab}</Text>
        </Text>
      </View>
    </View>
  );
};

// Event log component
const EventLog: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleAppStateChange = (event: AppStateChangeEvent) => {
    addEvent(`App State: ${event.previousState} → ${event.currentState}`);
  };

  const handleScreenChange = (event: ScreenChangeEvent) => {
    addEvent(`Screen: ${event.previousScreen || 'none'} → ${event.currentScreen}`);
  };

  // Use hooks to listen for changes
  useAppStateDetector(handleAppStateChange, true);
  useScreenChangeDetector(handleScreenChange, true);

  const clearLog = () => setEvents([]);

  return (
    <View style={styles.logContainer}>
      <View style={styles.logHeader}>
        <Text style={styles.sectionTitle}>📋 Event Log</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearLog}>
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
        • <Text style={styles.bold}>Screen Changes:</Text> Tap the navigation buttons above to simulate screen changes
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
  return (
    <AppStateDetector
      enableLogging={true}
      onAppOpened={() => Alert.alert('App Opened!', 'Welcome back!')}
      onAppClosed={() => console.log('App closed - goodbye!')}
      onAppBackground={() => console.log('App moved to background')}
      onAppInactive={() => console.log('App became inactive')}
      onAppActive={() => console.log('App became active')}
      onAppStateChange={(event) => {
        console.log('App state changed:', event);
      }}
      onScreenChange={(event) => {
        console.log('Screen changed:', event);
      }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🔍 App State Detector</Text>
          <Text style={styles.subtitle}>
            Monitor app states and screen navigation changes
          </Text>
          
          <AppStateDisplay />
          <ScreenNavigationExample />
          <Instructions />
          <EventLog />
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
