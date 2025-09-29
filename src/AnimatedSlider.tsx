import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';

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
   * Label text to display on the slider
   */
  label?: string;
  
  /**
   * Style for the label text
   */
  labelStyle?: TextStyle;
  
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

  /**
   * Enable gradient effect for active track (transparent at left to activeTrackColor at right)
   * @default false
   */
  useGradient?: boolean;
}

const defaultSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  onActivate,
  disabled = false,
  label,
  labelStyle,
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
  useGradient = false,
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
  
  const panGesture = useMemo(() => 
    Gesture.Pan()
      .enabled(!disabled)
      .onStart(() => {
        // Store the starting position (already in translateX.value)
      })
      .onUpdate((event) => {
        if (disabled) return;
        
        const newTranslateX = Math.max(
          0,
          Math.min(maxTranslateX, event.translationX)
        );
        translateX.value = newTranslateX;
        
        // Check if we've reached the activation point
        if (newTranslateX >= activationPoint && !isActivated.current) {
          isActivated.current = true;
          runOnJS(handleActivation)();
        }
      })
      .onEnd(() => {
        if (disabled) return;
        
        // Always spring back to start position
        translateX.value = withSpring(0, springConfig);
        isActivated.current = false;
      }),
    [disabled, maxTranslateX, activationPoint, handleActivation, springConfig]
  );
  
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
        {useGradient ? (
          <Animated.View style={[styles.activeTrackContainer, activeTrackAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', activeTrackColor]}
              locations={[0, 1]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.activeTrackGradient}
            />
          </Animated.View>
        ) : (
          <Animated.View style={[styles.activeTrack, activeTrackAnimatedStyle]} />
        )}
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
    activeTrackContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      borderRadius,
      overflow: 'hidden',
    },
    activeTrackGradient: {
      flex: 1,
      width: '100%',
      height: '100%',
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
    },
  });

export default AnimatedSlider;
