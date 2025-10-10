import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';
import { AuctionIcon, PaymentIcon, ProfileIcon, SettingsIcon } from './components/TabIcons';

// Example showing how to use SVG icons instead of emoji strings
const TabNavigationWithSVGExample: React.FC = () => {
  // Define your tabs configuration with SVG icons
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      icon: <AuctionIcon color="#8E8E93" size={24} />, // Default inactive color
      component: AuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <PaymentIcon color="#8E8E93" size={24} />,
      component: PaymentScreen,
    },
    // Example of additional tabs you could add:
    // {
    //   id: 'profile',
    //   label: 'Profile',
    //   icon: <ProfileIcon color="#8E8E93" size={24} />,
    //   component: ProfileScreen,
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: <SettingsIcon color="#8E8E93" size={24} />,
    //   component: SettingsScreen,
    // },
  ];

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    console.log(`Switched to tab: ${tabId}`);
  };

  // Handle auction interactions
  const handleBidPress = (itemId: string) => {
    Alert.alert('Bid Placed', `You placed a bid on item ${itemId}`);
  };

  const handleAuctionItemPress = (itemId: string) => {
    Alert.alert('Item Details', `Viewing details for item ${itemId}`);
  };

  // Handle payment interactions
  const handlePaymentPress = (method: any, amount: number) => {
    Alert.alert(
      'Payment Processing',
      `Processing $${amount.toFixed(2)} via ${method.label}`
    );
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'Opening payment method setup...');
  };

  // Create enhanced components with event handlers
  const EnhancedAuctionScreen = () => (
    <AuctionScreen
      onBidPress={handleBidPress}
      onItemPress={handleAuctionItemPress}
    />
  );

  const EnhancedPaymentScreen = () => (
    <PaymentScreen
      onPaymentPress={handlePaymentPress}
      onAddPaymentMethod={handleAddPaymentMethod}
    />
  );

  // Update tabs with enhanced components and dynamic icons
  const enhancedTabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      // Icon will automatically get the active/inactive color from the tab navigation
      icon: <AuctionIcon size={24} />,
      component: EnhancedAuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <PaymentIcon size={24} />,
      component: EnhancedPaymentScreen,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <BottomTabNavigation
          tabs={enhancedTabs}
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

export default TabNavigationWithSVGExample;
