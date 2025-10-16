import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

// Tab configuration interface
export interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ComponentType<any>;
}

// Props interface
export interface AppleGlassBottomTabNavigationProps {
  tabs: TabConfig[];
  initialTab?: string;
  activeColor?: string;
  inactiveColor?: string;
  glassColor?: string;
  tabBarHeight?: number;
  containerStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconStyle?: TextStyle;
  contentStyle?: ViewStyle;
  onTabChange?: (tabId: string) => void;
  blurType?: 'light' | 'dark' | 'xlight';
  blurAmount?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const AppleGlassBottomTabNavigation: React.FC<AppleGlassBottomTabNavigationProps> = ({
  tabs,
  initialTab,
  activeColor = '#007AFF',
  inactiveColor = 'rgba(255, 255, 255, 0.6)',
  glassColor = 'rgba(255, 255, 255, 0.1)',
  tabBarHeight = 90,
  containerStyle,
  tabBarStyle,
  tabStyle,
  labelStyle,
  iconStyle,
  contentStyle,
  onTabChange,
  blurType = 'light',
  blurAmount = 10,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '');
  
  // Animation values for each tab
  const tabAnimations = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = {
        scale: new Animated.Value(tab.id === activeTab ? 1.1 : 1),
        opacity: new Animated.Value(tab.id === activeTab ? 1 : 0.7),
        translateY: new Animated.Value(tab.id === activeTab ? -2 : 0),
        iconScale: new Animated.Value(tab.id === activeTab ? 1.2 : 1),
        glowOpacity: new Animated.Value(tab.id === activeTab ? 1 : 0),
      };
      return acc;
    }, {} as Record<string, any>)
  ).current;

  // Background blur animation
  const backgroundBlur = useRef(new Animated.Value(blurAmount)).current;
  
  // Active tab indicator animation
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = screenWidth / tabs.length;

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    // Animate indicator position
    Animated.spring(indicatorPosition, {
      toValue: activeIndex * indicatorWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Animate all tabs
    tabs.forEach((tab, index) => {
      const isActive = tab.id === activeTab;
      const animations = tabAnimations[tab.id];
      
      Animated.parallel([
        Animated.spring(animations.scale, {
          toValue: isActive ? 1.1 : 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(animations.opacity, {
          toValue: isActive ? 1 : 0.7,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(animations.translateY, {
          toValue: isActive ? -2 : 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(animations.iconScale, {
          toValue: isActive ? 1.2 : 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(animations.glowOpacity, {
          toValue: isActive ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [activeTab, tabs, indicatorPosition, indicatorWidth, tabAnimations]);

  const handleTabPress = (tabId: string) => {
    if (tabId === activeTab) return;
    
    // Haptic feedback (iOS only)
    if (Platform.OS === 'ios') {
      // You can add haptic feedback here if needed
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleTabPressIn = (tabId: string) => {
    const animations = tabAnimations[tabId];
    Animated.spring(animations.scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleTabPressOut = (tabId: string) => {
    const animations = tabAnimations[tabId];
    const isActive = tabId === activeTab;
    Animated.spring(animations.scale, {
      toValue: isActive ? 1.1 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Content Area */}
      <View style={[styles.content, contentStyle]}>
        {ActiveComponent ? <ActiveComponent /> : null}
      </View>

      {/* Glass Tab Bar Container */}
      <View style={[styles.tabBarContainer, { height: tabBarHeight }]}>
        {/* Background Blur Effect */}
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType={blurType}
            blurAmount={blurAmount}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: glassColor }]} />
        )}
        
        {/* Glass Overlay */}
        <View style={[StyleSheet.absoluteFillObject, styles.glassOverlay]} />
        
        {/* Active Tab Indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: indicatorWidth - 20,
              transform: [{ translateX: indicatorPosition }],
            },
          ]}
        />

        {/* Tab Bar */}
        <View style={[styles.tabBar, tabBarStyle]}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            const color = isActive ? activeColor : inactiveColor;
            const animations = tabAnimations[tab.id];

            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, tabStyle]}
                onPress={() => handleTabPress(tab.id)}
                onPressIn={() => handleTabPressIn(tab.id)}
                onPressOut={() => handleTabPressOut(tab.id)}
                activeOpacity={1}
              >
                <Animated.View
                  style={[
                    styles.tabContent,
                    {
                      transform: [
                        { scale: animations.scale },
                        { translateY: animations.translateY },
                      ],
                      opacity: animations.opacity,
                    },
                  ]}
                >
                  {/* Glow Effect for Active Tab */}
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      {
                        opacity: animations.glowOpacity,
                      },
                    ]}
                  />
                  
                  {/* Icon Container */}
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      {
                        transform: [{ scale: animations.iconScale }],
                      },
                    ]}
                  >
                    {React.cloneElement(tab.icon, {
                      color: color,
                      size: 24,
                      style: [{ color }, iconStyle],
                    })}
                  </Animated.View>

                  {/* Label */}
                  <Text
                    style={[
                      styles.label,
                      { color },
                      labelStyle,
                      isActive && styles.activeLabel,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBarContainer: {
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 10,
  },
  glassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 20, // Safe area padding
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    top: -15,
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    left: 10,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    height: 28,
    width: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  activeLabel: {
    fontWeight: '600',
    textShadowColor: 'rgba(0, 122, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});

export default AppleGlassBottomTabNavigation;
