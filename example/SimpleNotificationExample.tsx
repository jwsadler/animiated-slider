import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TopNotification } from '../src/components/TopNotification';

const SimpleNotificationExample: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        {/* Notifications */}
        <TopNotification
          visible={showSuccess}
          message="Payment completed successfully!"
          type="success"
          duration={3000}
          onDismiss={() => setShowSuccess(false)}
        />

        <TopNotification
          visible={showError}
          message="Failed to process payment"
          type="error"
          duration={5000}
          onDismiss={() => setShowError(false)}
        />

        <TopNotification
          visible={showWarning}
          message="Session expires in 5 minutes"
          type="warning"
          duration={0} // No auto-dismiss
          onDismiss={() => setShowWarning(false)}
        />

        <TopNotification
          visible={showInfo}
          message="New features available!"
          type="info"
          icon="🚀"
          duration={4000}
          onDismiss={() => setShowInfo(false)}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Simple Notification Example</Text>
          <Text style={styles.subtitle}>
            Tap buttons to show different notification types
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={() => setShowSuccess(true)}
          >
            <Text style={styles.buttonText}>Show Success</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.errorButton]}
            onPress={() => setShowError(true)}
          >
            <Text style={styles.buttonText}>Show Error</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={() => setShowWarning(true)}
          >
            <Text style={styles.buttonText}>Show Warning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.infoButton]}
            onPress={() => setShowInfo(true)}
          >
            <Text style={styles.buttonText}>Show Info</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40, // Space for notifications
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  errorButton: {
    backgroundColor: '#EF4444',
  },
  warningButton: {
    backgroundColor: '#F59E0B',
  },
  infoButton: {
    backgroundColor: '#3B82F6',
  },
});

export default SimpleNotificationExample;
