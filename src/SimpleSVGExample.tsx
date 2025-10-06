import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation, { TabConfig } from './BottomTabNavigation';
import { AuctionIcon, PaymentIcon, ProfileIcon } from './components/TabIcons';

// Simple screen components
const Screen1 = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Screen 1</Text>
  </View>
);

const Screen2 = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Screen 2</Text>
  </View>
);

const Screen3 = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Screen 3</Text>
  </View>
);

// SIMPLE EXAMPLE - Just copy this!
const SimpleSVGExample: React.FC = () => {
  const tabs: TabConfig[] = [
    {
      id: 'tab1',
      label: 'Tab 1',
      icon: <AuctionIcon color="#8E8E93" size={24} />,
      component: Screen1,
    },
    {
      id: 'tab2',
      label: 'Tab 2', 
      icon: <PaymentIcon color="#8E8E93" size={24} />,
      component: Screen2,
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      icon: <ProfileIcon color="#8E8E93" size={24} />,
      component: Screen3,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <BottomTabNavigation
          tabs={tabs}
          initialTab="tab1"
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
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SimpleSVGExample;
