import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Ably from 'ably';
import AnimatedSlider from '../src/AnimatedSlider';

// Example Ably integration with the Animated Slider
const AblyIntegrationExample: React.FC = () => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [sliderActivations, setSliderActivations] = useState<number>(0);
  const [remoteActivations, setRemoteActivations] = useState<number>(0);

  // Initialize Ably connection
  useEffect(() => {
    // Replace with your actual Ably API key
    const ablyClient = new Ably.Realtime({
      key: 'your-ably-api-key', // Replace with your actual API key
      clientId: `slider-user-${Math.random().toString(36).substr(2, 9)}`,
    });

    const sliderChannel = ablyClient.channels.get('slider-activations');

    // Connection state monitoring
    ablyClient.connection.on('connected', () => {
      setConnectionStatus('connected');
      console.log('Connected to Ably');
    });

    ablyClient.connection.on('disconnected', () => {
      setConnectionStatus('disconnected');
    });

    ablyClient.connection.on('failed', () => {
      setConnectionStatus('failed');
    });

    // Listen for slider activations from other users
    sliderChannel.subscribe('activation', (message) => {
      console.log('Received remote slider activation:', message.data);
      setRemoteActivations(prev => prev + 1);
      
      // Show notification for remote activations
      Alert.alert(
        'Remote Activation!', 
        `User ${message.clientId} activated their slider!`
      );
    });

    setAbly(ablyClient);
    setChannel(sliderChannel);

    // Cleanup on unmount
    return () => {
      sliderChannel.unsubscribe();
      ablyClient.close();
    };
  }, []);

  // Handle local slider activation
  const handleSliderActivation = useCallback(() => {
    const newCount = sliderActivations + 1;
    setSliderActivations(newCount);

    // Publish activation to Ably channel
    if (channel) {
      channel.publish('activation', {
        timestamp: new Date().toISOString(),
        activationCount: newCount,
        message: 'Slider activated!',
      });
    }

    Alert.alert('Slider Activated!', `Local activations: ${newCount}`);
  }, [channel, sliderActivations]);

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={styles.title}>Ably + Animated Slider</Text>
          
          {/* Connection Status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>
              Ably Status: {connectionStatus}
            </Text>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sliderActivations}</Text>
              <Text style={styles.statLabel}>Your Activations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{remoteActivations}</Text>
              <Text style={styles.statLabel}>Remote Activations</Text>
            </View>
          </View>

          {/* Animated Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Slide to broadcast activation to all users
            </Text>
            <AnimatedSlider
              onActivate={handleSliderActivation}
              width={320}
              height={70}
              thumbSize={60}
              trackColor="#E3F2FD"
              thumbColor="#2196F3"
              activeTrackColor="#1976D2"
              borderRadius={35}
              disabled={connectionStatus !== 'connected'}
              disabledOpacity={0.3}
            />
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>
              🌐 This slider broadcasts activations to all connected users via Ably
            </Text>
            <Text style={styles.instructions}>
              📱 Open this app on multiple devices to see real-time synchronization
            </Text>
            <Text style={styles.instructions}>
              🔒 Replace 'your-ably-api-key' with your actual Ably API key
            </Text>
          </View>
        </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1976D2',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  instructions: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default AblyIntegrationExample;
