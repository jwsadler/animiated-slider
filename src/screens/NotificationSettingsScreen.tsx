import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NotificationSettings } from '../types/notifications';
import { NotificationService } from '../services/NotificationService';
import { designTokens } from '../design-system/design-tokens';
import { componentStyles } from '../design-system/component-styles';

interface NotificationSettingsScreenProps {
  onBack?: () => void;
  onSettingsUpdate?: (settings: NotificationSettings[]) => void;
}

// Define the notification settings based on the Figma design
const NOTIFICATION_SETTINGS = [
  {
    id: 'new_followers',
    title: 'New followers',
    subtitle: 'Explanation subtitle',
    enabled: false,
  },
  {
    id: 'delivery_information',
    title: 'Delivery information',
    subtitle: 'Explanation subtitle',
    enabled: false,
  },
  {
    id: 'interests',
    title: 'Interests',
    subtitle: 'Explanation subtitle',
    enabled: true,
  },
  {
    id: 'saved_shows',
    title: 'Saved shows',
    subtitle: 'Explanation subtitle',
    enabled: false,
  },
  {
    id: 'saved_listings',
    title: 'Saved listings',
    subtitle: 'Explanation subtitle',
    enabled: true,
  },
];

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  onBack,
  onSettingsUpdate,
}) => {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);
  const [loading, setLoading] = useState<boolean>(false);

  const updateSetting = (settingId: string, enabled: boolean) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled }
          : setting
      )
    );

    // Optional callback for parent component
    if (onSettingsUpdate) {
      const updatedSettings = settings.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled }
          : setting
      );
      // onSettingsUpdate(updatedSettings);
    }
  };

  const renderSettingItem = (setting: typeof NOTIFICATION_SETTINGS[0]) => (
    <View key={setting.id} style={styles.settingCard}>
      <View style={styles.settingContent}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
        </View>
        <Switch
          value={setting.enabled}
          onValueChange={(value) => updateSetting(setting.id, value)}
          trackColor={{ 
            false: designTokens.colors.neutral[200], 
            true: designTokens.colors.primary[500] 
          }}
          thumbColor={designTokens.colors.neutral[0]}
          ios_backgroundColor={designTokens.colors.neutral[200]}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Notification settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settings.map(renderSettingItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.neutral[0],
  },
  backButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingRight: designTokens.spacing.sm,
    minWidth: 44, // Ensure good touch target
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: designTokens.colors.neutral[900],
    fontWeight: designTokens.typography.weights.normal,
  },
  headerTitle: {
    ...componentStyles.text.variants.h5,
    color: componentStyles.text.colors.primary,
    textAlign: 'center',
  },
  placeholder: {
    width: 44, // Match back button width for centering
  },
  content: {
    flex: 1,
    paddingTop: designTokens.spacing.md,
  },
  settingCard: {
    backgroundColor: designTokens.colors.neutral[0],
    marginHorizontal: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.xl,
    paddingHorizontal: designTokens.spacing.md + 4, // 20px to match design
    paddingVertical: designTokens.spacing.md + 4, // 20px to match design
    ...designTokens.shadows.sm,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: designTokens.spacing.md,
  },
  settingTitle: {
    ...componentStyles.text.variants.body1,
    color: componentStyles.text.colors.primary,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...componentStyles.text.variants.body2,
    color: componentStyles.text.colors.tertiary,
  },
});

export default NotificationSettingsScreen;
