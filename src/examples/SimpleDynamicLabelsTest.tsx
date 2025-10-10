import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useDynamicLabels, useLabel } from '../hooks/useDynamicLabels';

// Simple test component to verify Dynamic Labels work without Firebase
export const SimpleDynamicLabelsTest: React.FC = () => {
  const { labels, isLoading, getLabel } = useDynamicLabels();
  const [count, setCount] = useState(1);
  
  // Test single label hook with interpolation
  const { label: countLabel } = useLabel('interests.selectedCount', { count });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading labels...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔥 Dynamic Labels Test</Text>
        
        {/* Test basic label access */}
        <Text style={styles.label}>
          Welcome: {labels.common.welcome}
        </Text>
        
        {/* Test getLabel function */}
        <Text style={styles.label}>
          Categories: {getLabel('categories.title')}
        </Text>
        
        {/* Test interpolation */}
        <Text style={styles.label}>
          Selected: {countLabel}
        </Text>
        
        {/* Counter to test interpolation updates */}
        <View style={styles.counter}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setCount(Math.max(0, count - 1))}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.countText}>{count}</Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.infoText}>
            ✅ This works without Firebase!
          </Text>
          <Text style={styles.infoText}>
            🔄 Labels will auto-update every 10 seconds
          </Text>
          <Text style={styles.infoText}>
            📱 No additional dependencies required
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    color: '#333',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  info: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 5,
  },
});

export default SimpleDynamicLabelsTest;
