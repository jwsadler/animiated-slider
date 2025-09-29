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
import LinearGradient from 'react-native-linear-gradient';

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
  
  /**
   * Width of the background arrow as a percentage of track width (0.1 to 1.0)
   * @default 0.8
   */
  arrowWidth?: number;

  /**
   * Enable gradient effect for active track (transparent at bottom to activeTrackColor at top)
   * @default false
   */
  useGradient?: boolean;
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
  arrowWidth = 0.8,
  useGradient = false,
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
    arrowWidth,
  }), [width, height, actualThumbWidth, actualThumbHeight, trackColor, thumbColor, activeTrackColor, borderRadius, arrowWidth]);

  return (
    <View style={[styles.container, containerStyle, { opacity: containerOpacity }]}>
      <View style={[styles.track, trackStyle]}>
        {useGradient ? (
          <Animated.View style={[styles.activeTrackContainer, activeTrackAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', activeTrackColor]}
              locations={[0, 1]}
              style={styles.activeTrackGradient}
            />
          </Animated.View>
        ) : (
          <Animated.View style={[styles.activeTrack, activeTrackAnimatedStyle]} />
        )}
        
        {/* Background Arrow with Segmented Shaft */}
        <View style={styles.backgroundArrow}>
          {/* Arrow Head */}
          <View style={styles.arrowHead} />
          
          {/* Segmented Shaft - segments get closer together and narrower toward top */}
          <View style={styles.arrowShaft}>
            <View style={[styles.segment, styles.segment1, { marginBottom: 8 }]} />
            <View style={[styles.segment, styles.segment2, { marginBottom: 12 }]} />
            <View style={[styles.segment, styles.segment3, { marginBottom: 16 }]} />
            <View style={[styles.segment, styles.segment4, { marginBottom: 20 }]} />
            <View style={[styles.segment, styles.segment5, { marginBottom: 24 }]} />
            <View style={[styles.segment, styles.segment6, { marginBottom: 28 }]} />
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
  arrowWidth: number;
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
  arrowWidth,
}: StyleProps) => {
  // Calculate arrow dimensions based on track width and arrowWidth parameter
  const trackWidth = width - 10; // Track has 10px total padding
  const maxArrowWidth = trackWidth * Math.max(0.1, Math.min(1.0, arrowWidth)); // Clamp between 0.1 and 1.0
  const arrowHeadWidth = maxArrowWidth * 0.5; // Arrow head width - half of the base segment width for proper triangle
  const arrowHeadHeight = 20; // Fixed height for consistent arrow head proportions
  
  return StyleSheet.create({
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
    activeTrackContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius,
      overflow: 'hidden',
    },
    activeTrackGradient: {
      flex: 1,
      width: '100%',
      height: '100%',
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
      borderLeftWidth: arrowHeadWidth,
      borderRightWidth: arrowHeadWidth,
      borderBottomWidth: arrowHeadHeight, // Fixed height for consistent proportions
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
      height: 12,
      backgroundColor: '#DDD',
      opacity: 0.3,
      borderRadius: 2,
    },
    // Segments get progressively narrower toward the top
    segment1: { width: Math.max(2, maxArrowWidth * 0.17) },   // Narrowest (top) - 17% of max width
    segment2: { width: Math.max(3, maxArrowWidth * 0.33) },   // 33% of max width
    segment3: { width: Math.max(4, maxArrowWidth * 0.50) },   // 50% of max width
    segment4: { width: Math.max(5, maxArrowWidth * 0.67) },   // 67% of max width
    segment5: { width: Math.max(6, maxArrowWidth * 0.83) },   // 83% of max width
    segment6: { width: maxArrowWidth },                       // Widest (bottom) - 100% of max width
  });
};

export default VerticalAnimatedSlider;
