import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import { AuctionIcon, PaymentIcon } from './components/TabIcons';

// Simple screen component to test
const SimpleScreen: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>{title}</Text>
  </View>
);

// Minimal test to debug the text error
const DebugTextError: React.FC = () => {
  const tabs: TabConfig[] = [
    {
      id: 'test1',
      label: 'Test 1',
      icon: <AuctionIcon color="#8E8E93" size={24} />,
      component: () => <SimpleScreen title="Test Screen 1" />,
    },
    {
      id: 'test2',
      label: 'Test 2',
      icon: <PaymentIcon color="#8E8E93" size={24} />,
      component: () => <SimpleScreen title="Test Screen 2" />,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <BottomTabNavigation
          tabs={tabs}
          initialTab="test1"
          activeColor="#007AFF"
          inactiveColor="#8E8E93"
          backgroundColor="#FFFFFF"
          tabBarHeight={80}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  screenText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default DebugTextError;
