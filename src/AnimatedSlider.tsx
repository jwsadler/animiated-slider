import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { StyleSheet, ViewStyle } from 'react-native';

export interface AnimatedSliderProps {
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
   * Width of the slider container
   * @default 300
   */
  width?: number;
  
  /**
   * Height of the slider container
   * @default 60
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
   */
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

const defaultSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  onActivate,
  disabled = false,
  width = 300,
  height = 60,
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
  const translateX = useSharedValue(0);
  const isActivated = useRef(false);
  
  // Calculate the maximum translation distance
  const maxTranslateX = width - thumbSize - 10; // 10px padding
  const activationPoint = maxTranslateX * activationThreshold;
  
  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback && !disabled) {
      trigger(HapticFeedbackTypes.impactMedium);
    }
  }, [hapticFeedback, disabled]);
  
  const handleActivation = useCallback(() => {
    if (!disabled) {
      triggerHapticFeedback();
      onActivate();
    }
  }, [disabled, triggerHapticFeedback, onActivate]);
  
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (disabled) return;
      
      const newTranslateX = Math.max(
        0,
        Math.min(maxTranslateX, context.startX + event.translationX)
      );
      translateX.value = newTranslateX;
      
      // Check if we've reached the activation point
      if (newTranslateX >= activationPoint && !isActivated.current) {
        isActivated.current = true;
        runOnJS(handleActivation)();
      }
    },
    onEnd: () => {
      if (disabled) return;
      
      // Always spring back to start position
      translateX.value = withSpring(0, springConfig);
      isActivated.current = false;
    },
  });
  
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  
  const activeTrackAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      translateX.value,
      [0, maxTranslateX],
      [0, maxTranslateX + thumbSize / 2],
      Extrapolate.CLAMP
    );
    
    return {
      width,
    };
  });
  
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
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          enabled={!disabled}
        >
          <Animated.View style={[styles.thumb, thumbStyle, thumbAnimatedStyle]} />
        </PanGestureHandler>
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
      justifyContent: 'center',
      paddingHorizontal: 5,
      overflow: 'hidden',
    },
    activeTrack: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
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
  });

export default AnimatedSlider;
