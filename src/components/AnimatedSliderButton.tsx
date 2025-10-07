import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface AnimatedSliderButtonProps {
  /** Text to display on the slider */
  text?: string;
  /** Callback function when slider is fully activated */
  onSlideComplete: () => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom slider track style */
  trackStyle?: ViewStyle;
  /** Custom slider thumb style */
  thumbStyle?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Width of the slider */
  width?: number;
  /** Height of the slider */
  height?: number;
  /** Threshold percentage (0-1) for activation */
  activationThreshold?: number;
  /** Enable haptic feedback */
  enableHaptics?: boolean;
  /** Custom thumb content */
  thumbContent?: React.ReactNode;
  /** Custom track background color */
  trackColor?: string;
  /** Custom thumb color */
  thumbColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Disabled opacity */
  disabledOpacity?: number;
}

const AnimatedSliderButton: React.FC<AnimatedSliderButtonProps> = ({
  text = 'Slide to activate',
  onSlideComplete,
  disabled = false,
  containerStyle,
  trackStyle,
  thumbStyle,
  textStyle,
  width = 300,
  height = 60,
  activationThreshold = 0.8,
  enableHaptics = true,
  thumbContent,
  trackColor = '#E5E5E5',
  thumbColor = '#007AFF',
  textColor = '#666666',
  disabledOpacity = 0.5,
}) => {
  const translateX = useSharedValue(0);
  const isCompleted = useRef(false);
  
  // Calculate the maximum slide distance (track width - thumb width)
  const thumbWidth = height - 8; // 4px margin on each side
  const maxSlideDistance = width - thumbWidth - 8;
  
  const triggerHapticFeedback = () => {
    if (!enableHaptics) return;
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (Platform.OS === 'android') {
      // Android haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSlideComplete = () => {
    if (disabled) return;
    
    isCompleted.current = true;
    triggerHapticFeedback();
    onSlideComplete();
    
    // Reset position after a short delay
    setTimeout(() => {
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      isCompleted.current = false;
    }, 200);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      if (disabled) return;
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (disabled) return;
      
      const newTranslateX = context.startX + event.translationX;
      
      // Constrain the movement within bounds
      if (newTranslateX >= 0 && newTranslateX <= maxSlideDistance) {
        translateX.value = newTranslateX;
      } else if (newTranslateX < 0) {
        translateX.value = 0;
      } else {
        translateX.value = maxSlideDistance;
      }
    },
    onEnd: () => {
      if (disabled) return;
      
      const progress = translateX.value / maxSlideDistance;
      
      if (progress >= activationThreshold && !isCompleted.current) {
        // Slide to complete position and trigger callback
        translateX.value = withSpring(maxSlideDistance, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(handleSlideComplete)();
      } else {
        // Spring back to start
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    },
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, maxSlideDistance * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const containerOpacity = disabled ? disabledOpacity : 1;

  return (
    <View style={[styles.container, { width, height, opacity: containerOpacity }, containerStyle]}>
      <View style={[styles.track, { backgroundColor: trackColor }, trackStyle]}>
        {/* Text */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {text}
          </Text>
        </Animated.View>
        
        {/* Thumb */}
        <PanGestureHandler onGestureEvent={gestureHandler} enabled={!disabled}>
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbWidth,
                height: thumbWidth,
                backgroundColor: thumbColor,
              },
              thumbStyle,
              thumbAnimatedStyle,
            ]}
          >
            {thumbContent || (
              <View style={styles.thumbIcon}>
                <Text style={styles.thumbIconText}>→</Text>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  thumb: {
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  thumbIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AnimatedSliderButton;
