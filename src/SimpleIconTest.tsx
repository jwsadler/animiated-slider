import React from 'react';
import { StyleSheet, Alert, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';
import { AuctionIcon, PaymentIcon } from './components/TabIcons';

// Simple test to verify SVG icons work without TypeScript errors
const SimpleIconTest: React.FC = () => {
  // Test with mixed icon types to ensure TypeScript compatibility
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      icon: <AuctionIcon color="#8E8E93" size={24} />, // SVG icon
      component: AuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: '💳', // Emoji string
      component: PaymentScreen,
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <BottomTabNavigation
          tabs={tabs}
          initialTab="auction"
          activeColor="#007AFF"
          inactiveColor="#8E8E93"
          backgroundColor="#FFFFFF"
          tabBarHeight={80}
          onTabChange={handleTabChange}
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
});

export default SimpleIconTest;
