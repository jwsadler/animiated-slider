import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuctionIcon } from './components/TabIcons';

// MINIMAL TEST - Just to see if SVG works without any navigation
const MinimalTest: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minimal SVG Test</Text>
      
      {/* Test 1: Just render SVG */}
      <View style={styles.test}>
        <Text>Test 1: Direct SVG</Text>
        <AuctionIcon color="#007AFF" size={24} />
      </View>
      
      {/* Test 2: SVG in TouchableOpacity */}
      <TouchableOpacity 
        style={styles.test}
        onPress={() => console.log('SVG clicked')}
      >
        <Text>Test 2: Clickable SVG</Text>
        <AuctionIcon color="#FF0000" size={24} />
      </TouchableOpacity>
      
      {/* Test 3: SVG in View */}
      <View style={styles.test}>
        <Text>Test 3: SVG in View</Text>
        <View style={styles.iconContainer}>
          <AuctionIcon color="#00FF00" size={24} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  test: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default MinimalTest;
