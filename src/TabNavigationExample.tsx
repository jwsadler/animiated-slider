import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';

// Example of how to add more tabs in the future
// You can create additional screen components and add them here
const TabNavigationExample: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  // Define your tabs configuration
  const tabs: TabConfig[] = [
    {
      id: 'auction',
      label: 'Auctions',
      icon: '🔨', // You can replace with custom icons
      component: AuctionScreen,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: '💳',
      component: PaymentScreen,
    },
    // Easy to add more tabs in the future:
    // {
    //   id: 'profile',
    //   label: 'Profile',
    //   icon: '👤',
    //   component: ProfileScreen,
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: '⚙️',
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
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Toggle Button for Disabled State */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: isDisabled ? '#FF3B30' : '#34C759' }
            ]}
            onPress={() => setIsDisabled(!isDisabled)}
          >
            <Text style={styles.toggleText}>
              {isDisabled ? '🚫 Navigation Disabled' : '✅ Navigation Enabled'}
            </Text>
          </TouchableOpacity>
        </View>

        <BottomTabNavigation
          tabs={enhancedTabs}
          initialTab="auction"
          activeColor="#007AFF"
          inactiveColor="#8E8E93"
          backgroundColor="#FFFFFF"
          tabBarHeight={80}
          onTabChange={handleTabChange}
          disabled={isDisabled}
          disabledColor="#C7C7CC"
          disabledOpacity={0.6}
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
  toggleContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TabNavigationExample;
