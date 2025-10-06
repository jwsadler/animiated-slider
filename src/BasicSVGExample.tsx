import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';
import { AuctionIcon, PaymentIcon } from './components/TabIcons';

// Basic example that should work without TypeScript errors
const BasicSVGExample: React.FC = () => {
  // Simple tabs with explicit typing
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      icon: <AuctionIcon color="#8E8E93" size={24} />,
      component: AuctionScreen,
    },
    {
      id: 'payment', 
      label: 'Payment',
      icon: <PaymentIcon color="#8E8E93" size={24} />,
      component: PaymentScreen,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <BottomTabNavigation
          tabs={tabs}
          initialTab="auction"
          activeColor="#007AFF"
          inactiveColor="#8E8E93"
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

export default BasicSVGExample;
