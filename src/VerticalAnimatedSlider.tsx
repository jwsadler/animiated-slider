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
   * Size of the slider thumb
   * @default 50
   */
  thumbSize?: number;

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
  const isActivated = useRef(false);

  const maxTranslateY = height - thumbSize - 10; // 10 for padding

  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback) {
      HapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  }, [hapticFeedback]);

  const handleActivation = useCallback(() => {
    if (!disabled && !isActivated.current) {
      isActivated.current = true;
      triggerHapticFeedback();
      onActivate();
    }
  }, [disabled, onActivate, triggerHapticFeedback]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      // Invert the translation - negative values move up from bottom
      const newTranslateY = Math.max(
        Math.min(-event.translationY, maxTranslateY),
        0
      );
      translateY.value = newTranslateY;

      // Check if we've reached the activation threshold
      const progress = newTranslateY / maxTranslateY;
      if (progress >= activationThreshold && !isActivated.current) {
        runOnJS(handleActivation)();
      }
    })
    .onEnd(() => {
      // Reset the thumb position with spring animation
      translateY.value = withSpring(0, springConfig);
      isActivated.current = false;
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -translateY.value }], // Negative to move up
  }));

  const activeTrackAnimatedStyle = useAnimatedStyle(() => ({
    height: translateY.value + thumbSize / 2,
  }));

  const containerOpacity = disabled ? disabledOpacity : 1;

  const styles = useMemo(() => createStyles({
    width,
    height,
    thumbSize,
    trackColor,
    thumbColor,
    activeTrackColor,
    borderRadius,
  }), [width, height, thumbSize, trackColor, thumbColor, activeTrackColor, borderRadius]);

  return (
    <View style={[styles.container, containerStyle, { opacity: containerOpacity }]}>
      <View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.activeTrack, activeTrackAnimatedStyle]} />
        {label && (
          <Text style={[styles.label, labelStyle, { opacity: disabled ? disabledOpacity : 1 }]}>
            {label}
          </Text>
        )}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, thumbStyle, thumbAnimatedStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
};

interface StyleProps {
  width: number;
  height: number;
  thumbSize: number;
  trackColor: string;
  thumbColor: string;
  activeTrackColor: string;
  borderRadius: number;
}

const createStyles = ({
  width,
  height,
  thumbSize,
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
      width: thumbSize,
      height: thumbSize,
      backgroundColor: thumbColor,
      borderRadius: thumbSize / 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    label: {
      position: 'absolute',
      alignSelf: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: '#666',
      textAlign: 'center',
      zIndex: 1,
      transform: [{ rotate: '90deg' }], // Rotate text for vertical orientation
    },
  });

export default VerticalAnimatedSlider;
