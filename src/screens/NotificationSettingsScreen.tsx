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

interface NotificationSettingsScreenProps {
  onBack?: () => void;
  onSettingsUpdate?: (settings: NotificationSettings[]) => void;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  onBack,
  onSettingsUpdate,
}) => {
  const [settings, setSettings] = useState<NotificationSettings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedSettings = await NotificationService.getSettings();
      setSettings(fetchedSettings);
    } catch (err) {
      setError('Failed to load notification settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (
    settingId: string,
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    setSaving(true);

    try {
      await NotificationService.updateSettings(settingId, { [field]: value });
      
      setSettings(prev =>
        prev.map(setting =>
          setting.id === settingId
            ? { ...setting, [field]: value }
            : setting
        )
      );

      if (onSettingsUpdate) {
        const updatedSettings = settings.map(setting =>
          setting.id === settingId
            ? { ...setting, [field]: value }
            : setting
        );
        onSettingsUpdate(updatedSettings);
      }
    } catch (err) {
      console.error('Error updating setting:', err);
      Alert.alert('Error', 'Failed to update notification setting');
    } finally {
      setSaving(false);
    }
  };

  const toggleAllNotifications = async (enabled: boolean) => {
    setSaving(true);

    try {
      const updatePromises = settings.map(setting =>
        NotificationService.updateSettings(setting.id, { enabled })
      );

      await Promise.all(updatePromises);

      setSettings(prev =>
        prev.map(setting => ({ ...setting, enabled }))
      );

      if (onSettingsUpdate) {
        const updatedSettings = settings.map(setting => ({ ...setting, enabled }));
        onSettingsUpdate(updatedSettings);
      }
    } catch (err) {
      console.error('Error updating all settings:', err);
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: NotificationSettings['type']) => {
    switch (type) {
      case 'new_follower':
        return '👤';
      case 'delivery':
        return '📦';
      case 'recommendations':
        return '💡';
      case 'referrals':
        return '🎁';
      case 'rewards':
        return '⭐';
      case 'account':
        return '🔒';
      default:
        return '📱';
    }
  };

  const renderSettingItem = (setting: NotificationSettings) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <View style={styles.settingTitleRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getTypeIcon(setting.type)}</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{setting.label}</Text>
            <Text style={styles.settingDescription}>{setting.description}</Text>
          </View>
        </View>
        <Switch
          value={setting.enabled}
          onValueChange={(value) => updateSetting(setting.id, 'enabled', value)}
          trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
          thumbColor={setting.enabled ? '#FFFFFF' : '#FFFFFF'}
          disabled={saving}
        />
      </View>

      {setting.enabled && (
        <View style={styles.subSettings}>
          <View style={styles.subSettingRow}>
            <View style={styles.subSettingInfo}>
              <Text style={styles.subSettingLabel}>Push Notifications</Text>
              <Text style={styles.subSettingDescription}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={setting.pushEnabled}
              onValueChange={(value) => updateSetting(setting.id, 'pushEnabled', value)}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={setting.pushEnabled ? '#FFFFFF' : '#FFFFFF'}
              disabled={saving}
            />
          </View>

          <View style={styles.subSettingRow}>
            <View style={styles.subSettingInfo}>
              <Text style={styles.subSettingLabel}>Email Notifications</Text>
              <Text style={styles.subSettingDescription}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={setting.emailEnabled}
              onValueChange={(value) => updateSetting(setting.id, 'emailEnabled', value)}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={setting.emailEnabled ? '#FFFFFF' : '#FFFFFF'}
              disabled={saving}
            />
          </View>
        </View>
      )}
    </View>
  );

  const allEnabled = settings.every(setting => setting.enabled);
  const someEnabled = settings.some(setting => setting.enabled);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity onPress={loadSettings} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Master Toggle */}
        <View style={styles.masterToggleContainer}>
          <View style={styles.masterToggleContent}>
            <View style={styles.masterToggleInfo}>
              <Text style={styles.masterToggleTitle}>All Notifications</Text>
              <Text style={styles.masterToggleDescription}>
                {allEnabled 
                  ? 'All notification types are enabled'
                  : someEnabled
                  ? 'Some notification types are enabled'
                  : 'All notifications are disabled'}
              </Text>
            </View>
            <View style={styles.masterToggleActions}>
              {!allEnabled && (
                <TouchableOpacity
                  onPress={() => toggleAllNotifications(true)}
                  style={styles.enableAllButton}
                  disabled={saving}
                >
                  <Text style={styles.enableAllButtonText}>Enable All</Text>
                </TouchableOpacity>
              )}
              {someEnabled && (
                <TouchableOpacity
                  onPress={() => toggleAllNotifications(false)}
                  style={styles.disableAllButton}
                  disabled={saving}
                >
                  <Text style={styles.disableAllButtonText}>Disable All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Individual Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {settings.map(renderSettingItem)}
        </View>

        {/* Additional Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Notifications</Text>
          <Text style={styles.infoText}>
            • Push notifications appear on your device's lock screen and notification center
          </Text>
          <Text style={styles.infoText}>
            • Email notifications are sent to your registered email address
          </Text>
          <Text style={styles.infoText}>
            • You can customize each notification type independently
          </Text>
          <Text style={styles.infoText}>
            • Changes take effect immediately
          </Text>
        </View>

        {/* Loading Indicator */}
        {saving && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.savingText}>Saving changes...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  masterToggleContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  masterToggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterToggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  masterToggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  masterToggleDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  masterToggleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  enableAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  enableAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  disableAllButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disableAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  subSettings: {
    marginLeft: 44,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  subSettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subSettingInfo: {
    flex: 1,
    marginRight: 16,
  },
  subSettingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  subSettingDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  infoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  savingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  savingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationSettingsScreen;
