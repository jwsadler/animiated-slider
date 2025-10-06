import React from 'react';
import { StyleSheet, Alert, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';
import { AuctionIcon, PaymentIcon, ProfileIcon, SettingsIcon } from './components/TabIcons';
import { DynamicAuctionIcon, DynamicPaymentIcon, DynamicProfileIcon } from './components/DynamicTabIcons';

// Dummy components for demonstration
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile Screen</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>
      This would be your profile content
    </Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Settings Screen</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>
      This would be your settings content
    </Text>
  </View>
);

// Comprehensive example showing different icon types
const TabNavigationIconExamples: React.FC = () => {
  // Define tabs with different icon types
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      // Option 1: Dynamic SVG icon that responds to active/inactive state
      icon: <DynamicAuctionIcon isActive={false} activeColor="#007AFF" inactiveColor="#8E8E93" />,
      component: AuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      // Option 2: Dynamic SVG icon with enhanced visual feedback
      icon: <DynamicPaymentIcon isActive={false} activeColor="#007AFF" inactiveColor="#8E8E93" />,
      component: PaymentScreen,
    },
    {
      id: 'profile',
      label: 'Profile',
      // Option 3: Static SVG icon (color won't change automatically)
      icon: <ProfileIcon color="#8E8E93" size={24} />,
      component: ProfileScreen,
    },
    {
      id: 'settings',
      label: 'Settings',
      // Option 4: Emoji string (traditional approach)
      icon: '⚙️',
      component: SettingsScreen,
    },
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

  // Update tabs with enhanced components
  const enhancedTabs: TabConfig[] = [
    {
      ...tabs[0],
      component: EnhancedAuctionScreen,
    },
    {
      ...tabs[1],
      component: EnhancedPaymentScreen,
    },
    {
      ...tabs[2],
      component: ProfileScreen,
    },
    {
      ...tabs[3],
      component: SettingsScreen,
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

export default TabNavigationIconExamples;
