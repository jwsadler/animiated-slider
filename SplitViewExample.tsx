import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SplitView from './SplitView';

/**
 * Example usage of the SplitView component
 * Demonstrates various ways to use the split view functionality
 */
const SplitViewExample: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SplitView Component Examples</Text>
      
      {/* Example 1: Basic horizontal split (50/50) */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>1. Basic Horizontal Split (50/50)</Text>
        <SplitView style={styles.splitContainer}>
          <View style={[styles.panel, styles.panelLeft]}>
            <Text style={styles.panelText}>Left Panel</Text>
          </View>
          <View style={[styles.panel, styles.panelRight]}>
            <Text style={styles.panelText}>Right Panel</Text>
          </View>
        </SplitView>
      </View>

      {/* Example 2: Custom ratio split (70/30) */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>2. Custom Ratio Split (70/30)</Text>
        <SplitView 
          style={styles.splitContainer}
          splitRatio={[0.7, 0.3]}
        >
          <View style={[styles.panel, styles.panelLeft]}>
            <Text style={styles.panelText}>70% Width</Text>
          </View>
          <View style={[styles.panel, styles.panelRight]}>
            <Text style={styles.panelText}>30% Width</Text>
          </View>
        </SplitView>
      </View>

      {/* Example 3: Three-way split */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>3. Three-way Split (25/50/25)</Text>
        <SplitView 
          style={styles.splitContainer}
          splitRatio={[0.25, 0.5, 0.25]}
          gap={5}
        >
          <View style={[styles.panel, styles.panelLeft]}>
            <Text style={styles.panelText}>25%</Text>
          </View>
          <View style={[styles.panel, styles.panelCenter]}>
            <Text style={styles.panelText}>50%</Text>
          </View>
          <View style={[styles.panel, styles.panelRight]}>
            <Text style={styles.panelText}>25%</Text>
          </View>
        </SplitView>
      </View>

      {/* Example 4: Vertical split */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>4. Vertical Split</Text>
        <SplitView 
          style={styles.splitContainer}
          direction="vertical"
          gap={10}
        >
          <View style={[styles.panel, styles.panelTop]}>
            <Text style={styles.panelText}>Top Panel</Text>
          </View>
          <View style={[styles.panel, styles.panelBottom]}>
            <Text style={styles.panelText}>Bottom Panel</Text>
          </View>
        </SplitView>
      </View>

      {/* Example 5: Nested splits */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>5. Nested Splits</Text>
        <SplitView style={styles.splitContainer}>
          <View style={[styles.panel, styles.panelLeft]}>
            <Text style={styles.panelText}>Left Panel</Text>
          </View>
          <SplitView direction="vertical">
            <View style={[styles.panel, styles.panelTop]}>
              <Text style={styles.panelText}>Top Right</Text>
            </View>
            <View style={[styles.panel, styles.panelBottom]}>
              <Text style={styles.panelText}>Bottom Right</Text>
            </View>
          </SplitView>
        </SplitView>
      </View>

      {/* Example 6: Individual section styling */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>6. Individual Section Styling</Text>
        <SplitView 
          style={styles.splitContainer}
          gap={8}
          sectionStyles={[
            { backgroundColor: '#FF6B6B', borderRadius: 8 },
            { backgroundColor: '#4ECDC4', borderRadius: 8 },
            { backgroundColor: '#45B7D1', borderRadius: 8 },
          ]}
        >
          <View style={styles.panel}>
            <Text style={styles.panelText}>Red Section</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelText}>Teal Section</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelText}>Blue Section</Text>
          </View>
        </SplitView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  exampleContainer: {
    marginBottom: 30,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  splitContainer: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  panelLeft: {
    backgroundColor: '#E3F2FD',
  },
  panelRight: {
    backgroundColor: '#F3E5F5',
  },
  panelCenter: {
    backgroundColor: '#E8F5E8',
  },
  panelTop: {
    backgroundColor: '#FFF3E0',
  },
  panelBottom: {
    backgroundColor: '#FCE4EC',
  },
  panelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default SplitViewExample;
