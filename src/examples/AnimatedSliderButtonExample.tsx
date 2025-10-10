import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedSliderButton from '../components/AnimatedSliderButton';

const AnimatedSliderButtonExample: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);

  const handleSlideComplete = () => {
    setCompletionCount(prev => prev + 1);
    Alert.alert(
      'Slider Activated!',
      `The slider has been activated ${completionCount + 1} time(s)`,
      [{ text: 'OK' }]
    );
  };

  const handleCustomSlideComplete = () => {
    Alert.alert(
      'Custom Slider!',
      'This is a custom styled slider with different colors and text',
      [{ text: 'Great!' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Animated Slider Button Examples</Text>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Disabled State:</Text>
            <Switch
              value={isDisabled}
              onValueChange={setIsDisabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDisabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.completionText}>
            Completed: {completionCount} times
          </Text>
        </View>

        {/* Default Slider */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Default Slider</Text>
          <AnimatedSliderButton
            text="Slide to activate"
            onSlideComplete={handleSlideComplete}
            disabled={isDisabled}
          />
        </View>

        {/* Custom Styled Slider */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Custom Styled Slider</Text>
          <AnimatedSliderButton
            text="Swipe to unlock"
            onSlideComplete={handleCustomSlideComplete}
            disabled={isDisabled}
            width={280}
            height={50}
            trackColor="#FF6B6B"
            thumbColor="#4ECDC4"
            textColor="#FFFFFF"
            containerStyle={styles.customContainer}
          />
        </View>

        {/* Compact Slider */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Compact Slider</Text>
          <AnimatedSliderButton
            text="Slide →"
            onSlideComplete={() => Alert.alert('Compact!', 'Small slider activated')}
            disabled={isDisabled}
            width={200}
            height={40}
            trackColor="#F0F0F0"
            thumbColor="#FF9500"
            textColor="#333333"
          />
        </View>

        {/* High Threshold Slider */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>High Threshold (90%)</Text>
          <AnimatedSliderButton
            text="Slide almost all the way"
            onSlideComplete={() => Alert.alert('High Threshold!', 'You had to slide 90% to activate')}
            disabled={isDisabled}
            activationThreshold={0.9}
            trackColor="#E8E8E8"
            thumbColor="#34C759"
            textColor="#666666"
          />
        </View>

        {/* No Haptics Slider */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>No Haptic Feedback</Text>
          <AnimatedSliderButton
            text="Silent slide"
            onSlideComplete={() => Alert.alert('Silent!', 'No haptic feedback on this one')}
            disabled={isDisabled}
            enableHaptics={false}
            trackColor="#DDD6FE"
            thumbColor="#8B5CF6"
            textColor="#5B21B6"
          />
        </View>

        {/* Custom Thumb Content */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Custom Thumb Icon</Text>
          <AnimatedSliderButton
            text="Slide with custom icon"
            onSlideComplete={() => Alert.alert('Custom!', 'Custom thumb icon slider')}
            disabled={isDisabled}
            trackColor="#FEF3C7"
            thumbColor="#F59E0B"
            textColor="#92400E"
            thumbContent={
              <Text style={styles.customThumbIcon}>🚀</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  controlsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  completionText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  exampleContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
    textAlign: 'center',
  },
  customContainer: {
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customThumbIcon: {
    fontSize: 20,
  },
});

export default AnimatedSliderButtonExample;

