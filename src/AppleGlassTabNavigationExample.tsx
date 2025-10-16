import React from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppleGlassBottomTabNavigation, { TabConfig } from './AppleGlassBottomTabNavigation';
import AuctionScreen from './components/AuctionScreen';
import PaymentScreen from './components/PaymentScreen';

// Import icons (you can replace these with your preferred icon library)
// For this example, I'll create simple icon components
const HomeIcon = ({ color = '#007AFF', size = 24 }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />
);

const SearchIcon = ({ color = '#007AFF', size = 24 }) => (
  <View style={{ 
    width: size, 
    height: size, 
    borderWidth: 2, 
    borderColor: color, 
    borderRadius: size / 2 
  }} />
);

const HeartIcon = ({ color = '#007AFF', size = 24 }) => (
  <View style={{ 
    width: size, 
    height: size, 
    backgroundColor: color, 
    borderRadius: size / 2,
    transform: [{ rotate: '45deg' }]
  }} />
);

const ProfileIcon = ({ color = '#007AFF', size = 24 }) => (
  <View style={{ 
    width: size, 
    height: size, 
    backgroundColor: color, 
    borderRadius: size / 2 
  }} />
);

// Example of Apple Glass Tab Navigation
const AppleGlassTabNavigationExample: React.FC = () => {
  // Define your tabs configuration with beautiful icons
  const tabs: TabConfig[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      component: AuctionScreen,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <SearchIcon />,
      component: PaymentScreen,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <HeartIcon />,
      component: AuctionScreen,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
      component: PaymentScreen,
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
      component: EnhancedAuctionScreen,
    },
    {
      ...tabs[3],
      component: EnhancedPaymentScreen,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <AppleGlassBottomTabNavigation
          tabs={enhancedTabs}
          initialTab="home"
          activeColor="#007AFF"
          inactiveColor="rgba(255, 255, 255, 0.6)"
          glassColor="rgba(255, 255, 255, 0.1)"
          tabBarHeight={90}
          blurType="light"
          blurAmount={15}
          onTabChange={handleTabChange}
          containerStyle={styles.navigationContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Dark theme variant example
export const AppleGlassDarkTabNavigationExample: React.FC = () => {
  const tabs: TabConfig[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      component: AuctionScreen,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <SearchIcon />,
      component: PaymentScreen,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <HeartIcon />,
      component: AuctionScreen,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
      component: PaymentScreen,
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.darkContainer} edges={['top', 'left', 'right']}>
        <AppleGlassBottomTabNavigation
          tabs={tabs}
          initialTab="home"
          activeColor="#0A84FF"
          inactiveColor="rgba(255, 255, 255, 0.5)"
          glassColor="rgba(0, 0, 0, 0.3)"
          tabBarHeight={90}
          blurType="dark"
          blurAmount={20}
          onTabChange={handleTabChange}
          containerStyle={styles.darkNavigationContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navigationContainer: {
    backgroundColor: '#F2F2F7',
  },
  darkNavigationContainer: {
    backgroundColor: '#000000',
  },
});

export default AppleGlassTabNavigationExample;
