import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';

// Tab configuration interface
export interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactElement; // Only supports SVG React elements
  component: React.ComponentType<any>;
}

// Props interface
export interface BottomTabNavigationProps {
  tabs: TabConfig[];
  initialTab?: string;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  tabBarHeight?: number;
  containerStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconStyle?: TextStyle;
  contentStyle?: ViewStyle;
  onTabChange?: (tabId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  tabs,
  initialTab,
  activeColor = '#007AFF',
  inactiveColor = '#8E8E93',
  backgroundColor = '#FFFFFF',
  tabBarHeight = 80,
  containerStyle,
  tabBarStyle,
  tabStyle,
  labelStyle,
  iconStyle,
  contentStyle,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Content Area */}
      <View style={[styles.content, contentStyle]}>
        {ActiveComponent ? <ActiveComponent /> : null}
      </View>

      {/* Tab Bar */}
      <View style={[
        styles.tabBar,
        { height: tabBarHeight, backgroundColor },
        tabBarStyle
      ]}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const color = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, tabStyle]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={[styles.iconContainer]}>
                {tab.icon ? (
                  // Render SVG React component with dynamic color
                  React.cloneElement(tab.icon, { 
                    color: color,
                    size: 24 
                  })
                ) : null}
              </View>

              {/* Label */}
              <Text style={[
                styles.label,
                { color },
                labelStyle
              ]}>
                {tab.label || ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    paddingBottom: 20, // Account for safe area on newer devices
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    height: 24,
    width: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BottomTabNavigation;
