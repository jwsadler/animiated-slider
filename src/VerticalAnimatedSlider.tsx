import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import HapticFeedback from 'react-native-haptic-feedback';

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
}

export interface VerticalAnimatedSliderProps {
  /**
   * Callback function called when slider is fully activated
   */
  onActivate: () => void;

  /**
   * Whether the slider is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Label text to display on the slider
   */
  label?: string;
  
  /**
   * Style for the label text
   */
  labelStyle?: TextStyle;
  
  /**
   * Width of the slider container
   * @default 60
   */
  width?: number;

  /**
   * Height of the slider container
   * @default 300
   */
  height?: number;

  /**
   * Size of the slider thumb (deprecated - use thumbWidth and thumbHeight)
   * @default 50
   * @deprecated Use thumbWidth and thumbHeight instead
   */
  thumbSize?: number;

  /**
   * Width of the slider thumb
   * @default 50
   */
  thumbWidth?: number;

  /**
   * Height of the slider thumb
   * @default 30
   */
  thumbHeight?: number;

  /**
   * Background color of the slider track
   * @default '#E0E0E0'
   */
  trackColor?: string;

  /**
   * Background color of the slider thumb
   * @default '#FFFFFF'
   */
  thumbColor?: string;

  /**
   * Color of the active track (filled portion)
   * @default '#4CAF50'
   */
  activeTrackColor?: string;

  /**
   * Border radius of the slider
   * @default 30
   */
  borderRadius?: number;

  /**
   * Custom style for the container
   */
  containerStyle?: ViewStyle;

  /**
   * Custom style for the track
   */
  trackStyle?: ViewStyle;

  /**
   * Custom style for the thumb
   */
  thumbStyle?: ViewStyle;

  /**
   * Opacity when disabled
   * @default 0.5
   */
  disabledOpacity?: number;

  /**
   * Enable haptic feedback
   * @default true
   */
  hapticFeedback?: boolean;

  /**
   * Threshold percentage (0-1) at which the slider activates
   * @default 0.8
   */
  activationThreshold?: number;

  /**
   * Spring animation configuration
   * @default { damping: 15, stiffness: 150, mass: 1 }
   */
  springConfig?: SpringConfig;
}

const defaultSpringConfig: SpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const VerticalAnimatedSlider: React.FC<VerticalAnimatedSliderProps> = ({
  onActivate,
  disabled = false,
  label,
  labelStyle,
  width = 60,
  height = 300,
  thumbSize = 50,
  thumbWidth,
  thumbHeight,
  trackColor = '#E0E0E0',
  thumbColor = '#FFFFFF',
  activeTrackColor = '#4CAF50',
  borderRadius = 30,
  containerStyle,
  trackStyle,
  thumbStyle,
  disabledOpacity = 0.5,
  hapticFeedback = true,
  activationThreshold = 0.8,
  springConfig = defaultSpringConfig,
}) => {
  const translateY = useSharedValue(0);
  const isActivated = useSharedValue(false); // Use shared value instead of ref

  // Calculate actual thumb dimensions (with fallback to thumbSize for backward compatibility)
  const actualThumbWidth = thumbWidth ?? thumbSize;
  const actualThumbHeight = thumbHeight ?? (thumbSize * 0.6);

  const maxTranslateY = height - actualThumbHeight - 10; // 10 for padding

  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback) {
      HapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  }, [hapticFeedback]);

  const handleActivation = useCallback(() => {
    if (!disabled) {
      triggerHapticFeedback();
      onActivate();
    }
  }, [disabled, onActivate, triggerHapticFeedback]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      'worklet';
      // Invert the translation - negative values move up from bottom
      const newTranslateY = Math.max(
        Math.min(-event.translationY, maxTranslateY),
        0
      );
      translateY.value = newTranslateY;

      // Check if we've reached the activation threshold
      const progress = newTranslateY / maxTranslateY;
      if (progress >= activationThreshold && !isActivated.value) {
        isActivated.value = true;
        runOnJS(handleActivation)();
      }
    })
    .onEnd(() => {
      'worklet';
      // Reset the thumb position with spring animation
      translateY.value = withSpring(0, springConfig, () => {
        'worklet';
        // Reset activation state only after the spring animation completes
        isActivated.value = false;
      });
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -translateY.value }], // Negative to move up
  }));

  const activeTrackAnimatedStyle = useAnimatedStyle(() => ({
    height: translateY.value + actualThumbHeight / 2,
  }));

  const containerOpacity = disabled ? disabledOpacity : 1;

  const styles = useMemo(() => createStyles({
    width,
    height,
    thumbWidth: actualThumbWidth,
    thumbHeight: actualThumbHeight,
    trackColor,
    thumbColor,
    activeTrackColor,
    borderRadius,
  }), [width, height, actualThumbWidth, actualThumbHeight, trackColor, thumbColor, activeTrackColor, borderRadius]);

  return (
    <View style={[styles.container, containerStyle, { opacity: containerOpacity }]}>
      <View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.activeTrack, activeTrackAnimatedStyle]} />
        
        {/* Background Arrow with Segmented Shaft */}
        <View style={styles.backgroundArrow}>
          {/* Arrow Head */}
          <View style={styles.arrowHead} />
          
          {/* Segmented Shaft - segments get closer together toward top */}
          <View style={styles.arrowShaft}>
            <View style={[styles.segment, { marginBottom: 8 }]} />
            <View style={[styles.segment, { marginBottom: 12 }]} />
            <View style={[styles.segment, { marginBottom: 16 }]} />
            <View style={[styles.segment, { marginBottom: 20 }]} />
            <View style={[styles.segment, { marginBottom: 24 }]} />
            <View style={[styles.segment, { marginBottom: 28 }]} />
          </View>
        </View>
        
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, thumbStyle, thumbAnimatedStyle]}>
            {label && (
              <Text style={[styles.thumbLabel, labelStyle, { opacity: disabled ? disabledOpacity : 1 }]}>
                {label}
              </Text>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

interface StyleProps {
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  trackColor: string;
  thumbColor: string;
  activeTrackColor: string;
  borderRadius: number;
}

const createStyles = ({
  width,
  height,
  thumbWidth,
  thumbHeight,
  trackColor,
  thumbColor,
  activeTrackColor,
  borderRadius,
}: StyleProps) =>
  StyleSheet.create({
    container: {
      width,
      height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    track: {
      width: width - 10,
      height: height - 10,
      backgroundColor: trackColor,
      borderRadius,
      justifyContent: 'flex-end', // Align thumb to bottom
      alignItems: 'center',
      paddingVertical: 5,
      overflow: 'hidden',
    },
    activeTrack: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: activeTrackColor,
      borderRadius,
    },
    thumb: {
      width: thumbWidth,
      height: thumbHeight,
      backgroundColor: thumbColor,
      borderRadius: 8, // Small border radius for rectangular shape
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      textAlign: 'center',
      // No rotation - keep text horizontal
    },
    backgroundArrow: {
      position: 'absolute',
      top: '15%',
      bottom: '15%',
      alignSelf: 'center',
      zIndex: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    arrowHead: {
      width: 0,
      height: 0,
      borderLeftWidth: 12,
      borderRightWidth: 12,
      borderBottomWidth: 20,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#DDD',
      opacity: 0.3,
      marginBottom: 4,
    },
    arrowShaft: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-start',
    },
    segment: {
      width: 4,
      height: 12,
      backgroundColor: '#DDD',
      opacity: 0.3,
      borderRadius: 2,
    },
  });

export default VerticalAnimatedSlider;
