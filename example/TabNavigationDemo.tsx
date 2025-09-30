import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabNavigationExample from '../src/TabNavigationExample';

const TabNavigationDemo: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TabNavigationExample />
    </GestureHandlerRootView>
  );
};

export default TabNavigationDemo;
