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
  icon: string; // You can replace this with React.ReactNode for custom icons
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
  disabled?: boolean;
  disabledColor?: string;
  disabledOpacity?: number;
  disabledComponent?: React.ComponentType;
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
  disabled = false,
  disabledColor = '#C7C7CC',
  disabledOpacity = 0.6,
  disabledComponent,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '');

  const handleTabPress = (tabId: string) => {
    if (disabled) return;
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component;
  const DisabledComponent = disabledComponent;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Content Area */}
      <View style={[styles.content, contentStyle]}>
        {disabled && DisabledComponent ? (
          <DisabledComponent />
        ) : (
          <>
            {ActiveComponent && <ActiveComponent />}
            {disabled && !DisabledComponent && (
              <View style={[
                styles.disabledOverlay,
                { opacity: disabledOpacity }
              ]} />
            )}
          </>
        )}
      </View>

      {/* Tab Bar */}
      <View style={[
        styles.tabBar,
        { height: tabBarHeight, backgroundColor },
        tabBarStyle
      ]}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const color = disabled ? disabledColor : (isActive ? activeColor : inactiveColor);

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab, 
                tabStyle,
                disabled && { opacity: disabledOpacity }
              ]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              {/* Icon */}
              <Text style={[
                styles.icon,
                { color },
                iconStyle,
                disabled && { opacity: disabledOpacity }
              ]}>
                {tab.icon}
              </Text>

              {/* Label */}
              <Text style={[
                styles.label,
                { color },
                labelStyle,
                disabled && { opacity: disabledOpacity }
              ]}>
                {tab.label}
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
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F5F5',
    zIndex: 1000,
  },
});

export default BottomTabNavigation;
