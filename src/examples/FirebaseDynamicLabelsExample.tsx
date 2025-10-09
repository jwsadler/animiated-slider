import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { 
  useFirebaseDynamicLabels, 
  useFirebaseLabel, 
  useFirebaseLabels 
} from '../hooks/useFirebaseDynamicLabels';

// Example component showing Firebase Dynamic Labels in action
const FirebaseDynamicLabelsExample: React.FC = () => {
  const { labels, isLoading, updateLabels } = useFirebaseDynamicLabels();

  // Example of updating labels in Firebase
  const handleUpdateWelcomeMessage = async () => {
    try {
      await updateLabels({
        common: {
          ...labels.common,
          welcome: `🎉 Welcome! Updated at ${new Date().toLocaleTimeString()}`,
        },
      });
      Alert.alert('Success', 'Welcome message updated in Firebase!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update labels');
      console.error('Failed to update labels:', error);
    }
  };

  const handleUpdateInterestTitle = async () => {
    try {
      await updateLabels({
        interests: {
          ...labels.interests,
          title: `🎯 Interests (Updated ${new Date().toLocaleTimeString()})`,
        },
      });
      Alert.alert('Success', 'Interest title updated in Firebase!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update labels');
      console.error('Failed to update labels:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Firebase labels...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.title}>🔥 Firebase Dynamic Labels</Text>
          <Text style={styles.subtitle}>Real-time updates from Firebase!</Text>

          {/* Common Labels Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Labels</Text>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>welcome:</Text>
              <Text style={styles.labelValue}>{labels.common.welcome}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>loading:</Text>
              <Text style={styles.labelValue}>{labels.common.loading}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>error:</Text>
              <Text style={styles.labelValue}>{labels.common.error}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={handleUpdateWelcomeMessage}
            >
              <Text style={styles.updateButtonText}>Update Welcome Message</Text>
            </TouchableOpacity>
          </View>

          {/* Interests Labels Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interest Labels</Text>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>title:</Text>
              <Text style={styles.labelValue}>{labels.interests.title}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>subtitle:</Text>
              <Text style={styles.labelValue}>{labels.interests.subtitle}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>searchPlaceholder:</Text>
              <Text style={styles.labelValue}>{labels.interests.searchPlaceholder}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={handleUpdateInterestTitle}
            >
              <Text style={styles.updateButtonText}>Update Interest Title</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Labels Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Labels</Text>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>title:</Text>
              <Text style={styles.labelValue}>{labels.categories.title}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>refreshing:</Text>
              <Text style={styles.labelValue}>{labels.categories.refreshing}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelKey}>emptyState:</Text>
              <Text style={styles.labelValue}>{labels.categories.emptyState}</Text>
            </View>
          </View>

          {/* Buttons Labels Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Button Labels</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.demoButton}>
                <Text style={styles.demoButtonText}>{labels.buttons.continue}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.demoButton}>
                <Text style={styles.demoButtonText}>{labels.buttons.back}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.demoButton}>
                <Text style={styles.demoButtonText}>{labels.buttons.next}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.demoButton}>
                <Text style={styles.demoButtonText}>{labels.buttons.finish}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔥 Firebase Integration</Text>
            <Text style={styles.infoText}>
              These labels are loaded from Firebase Realtime Database and update in real-time!
              Try updating labels from the Firebase console to see them change instantly.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Example component using individual label hooks
const SingleLabelExample: React.FC = () => {
  const { label: welcomeLabel, isLoading } = useFirebaseLabel('common.welcome');
  const { labels: buttonLabels } = useFirebaseLabels(['buttons.continue', 'buttons.back']);

  if (isLoading) {
    return <ActivityIndicator size="small" color="#007AFF" />;
  }

  return (
    <View style={styles.singleLabelContainer}>
      <Text style={styles.singleLabelTitle}>Single Label Hook Example</Text>
      <Text style={styles.singleLabelText}>Welcome: {welcomeLabel}</Text>
      <Text style={styles.singleLabelText}>Continue: {buttonLabels['buttons.continue']}</Text>
      <Text style={styles.singleLabelText}>Back: {buttonLabels['buttons.back']}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  labelKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    width: 120,
    flexShrink: 0,
  },
  labelValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  demoButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#856404',
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  singleLabelContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
  },
  singleLabelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  singleLabelText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});

export default FirebaseDynamicLabelsExample;
