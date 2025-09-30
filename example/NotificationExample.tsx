import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TopNotification, NotificationContainer } from '../src/components';
import { useNotification } from '../src/hooks/useNotification';

const NotificationExample: React.FC = () => {
  const {
    notifications,
    hide,
    remove,
    clear,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotification();

  const handleShowSuccess = () => {
    showSuccess('Payment completed successfully!', {
      duration: 3000,
      icon: '🎉',
    });
  };

  const handleShowError = () => {
    showError('Failed to process payment. Please try again.', {
      duration: 5000,
      dismissible: true,
    });
  };

  const handleShowWarning = () => {
    showWarning('Your session will expire in 5 minutes', {
      duration: 0, // No auto-dismiss
      dismissible: true,
      showCloseButton: true,
    });
  };

  const handleShowInfo = () => {
    showInfo('New features are now available!', {
      duration: 4000,
      icon: '🚀',
    });
  };

  const handleShowCustom = () => {
    showInfo('Custom styled notification', {
      duration: 3000,
      icon: '⭐',
      // Custom styling would be applied via NotificationContainer props
    });
  };

  const handleShowMultiple = () => {
    showSuccess('First notification');
    setTimeout(() => showWarning('Second notification'), 500);
    setTimeout(() => showError('Third notification'), 1000);
    setTimeout(() => showInfo('Fourth notification'), 1500);
  };

  const handleShowNonDismissible = () => {
    showError('Critical error - cannot be dismissed', {
      duration: 0,
      dismissible: false,
      showCloseButton: false,
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        {/* Notification Container */}
        <NotificationContainer
          notifications={notifications}
          onDismiss={hide}
          onRemove={remove}
          maxNotifications={3}
          notificationSpacing={8}
          globalAnimationDuration={300}
        />

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Notification Examples</Text>
          <Text style={styles.subtitle}>
            Tap the buttons below to see different notification types
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Notifications</Text>
            
            <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleShowSuccess}>
              <Text style={styles.buttonText}>Show Success</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleShowError}>
              <Text style={styles.buttonText}>Show Error</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleShowWarning}>
              <Text style={styles.buttonText}>Show Warning (No Auto-dismiss)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={handleShowInfo}>
              <Text style={styles.buttonText}>Show Info</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Examples</Text>
            
            <TouchableOpacity style={[styles.button, styles.customButton]} onPress={handleShowCustom}>
              <Text style={styles.buttonText}>Custom Icon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.multipleButton]} onPress={handleShowMultiple}>
              <Text style={styles.buttonText}>Show Multiple (Stacked)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.criticalButton]} onPress={handleShowNonDismissible}>
              <Text style={styles.buttonText}>Non-dismissible</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Management</Text>
            
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clear}>
              <Text style={styles.buttonText}>Clear All Notifications</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoTitle}>Features:</Text>
            <Text style={styles.infoText}>• Configurable duration and auto-dismiss</Text>
            <Text style={styles.infoText}>• Custom icons and styling</Text>
            <Text style={styles.infoText}>• Dismissible or non-dismissible</Text>
            <Text style={styles.infoText}>• Multiple notification stacking</Text>
            <Text style={styles.infoText}>• Smooth slide-in/fade-out animations</Text>
            <Text style={styles.infoText}>• Safe area and status bar aware</Text>
            <Text style={styles.infoText}>• TypeScript support</Text>
          </View>
        </ScrollView>
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
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40, // Extra space for notifications
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  customButton: {
    backgroundColor: '#8B5CF6',
  },
  multipleButton: {
    backgroundColor: '#06B6D4',
  },
  criticalButton: {
    backgroundColor: '#DC2626',
  },
  clearButton: {
    backgroundColor: '#6B7280',
  },
  info: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});

export default NotificationExample;
