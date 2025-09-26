import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedSlider from '../src/AnimatedSlider';

const App: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [activationCount, setActivationCount] = useState(0);

  const handleSliderActivation = () => {
    setActivationCount(prev => prev + 1);
    Alert.alert('Slider Activated!', `Activation count: ${activationCount + 1}`);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Animated Slider Demo</Text>
          
          <View style={styles.controlsContainer}>
            <View style={styles.control}>
              <Text style={styles.controlLabel}>Disabled:</Text>
              <Switch
                value={isDisabled}
                onValueChange={setIsDisabled}
              />
            </View>
            
            <Text style={styles.activationText}>
              Activations: {activationCount}
            </Text>
          </View>

          <View style={styles.slidersContainer}>
            {/* Default Slider */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Default Slider with Label</Text>
              <AnimatedSlider
                onActivate={handleSliderActivation}
                disabled={isDisabled}
                label="Slide to activate"
              />
            </View>

            {/* Custom Styled Slider */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Custom Styled Slider</Text>
              <AnimatedSlider
                onActivate={handleSliderActivation}
                disabled={isDisabled}
                width={250}
                height={50}
                thumbSize={40}
                trackColor="#FFE0E0"
                thumbColor="#FF6B6B"
                activeTrackColor="#FF4757"
                borderRadius={25}
                activationThreshold={0.7}
                label="Swipe right"
                labelStyle={{ color: '#FF4757', fontWeight: 'bold' }}
              />
            </View>

            {/* Compact Slider */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Compact Slider</Text>
              <AnimatedSlider
                onActivate={handleSliderActivation}
                disabled={isDisabled}
                width={200}
                height={40}
                thumbSize={30}
                trackColor="#E8F4FD"
                thumbColor="#3742FA"
                activeTrackColor="#5352ED"
                borderRadius={20}
                disabledOpacity={0.3}
                label="→"
                labelStyle={{ fontSize: 18, color: '#3742FA' }}
              />
            </View>

            {/* Success Theme Slider */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Success Theme</Text>
              <AnimatedSlider
                onActivate={handleSliderActivation}
                disabled={isDisabled}
                width={280}
                height={55}
                thumbSize={45}
                trackColor="#F0F8F0"
                thumbColor="#2ECC71"
                activeTrackColor="#27AE60"
                borderRadius={27}
                springConfig={{
                  damping: 20,
                  stiffness: 200,
                  mass: 0.8,
                }}
              />
            </View>
          </View>

          <Text style={styles.instructions}>
            Slide the thumb from left to right to activate the slider.
            It will spring back to the starting position after release.
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
  },
  activationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  slidersContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  sliderSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export default App;
