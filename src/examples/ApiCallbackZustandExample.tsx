import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from 'react-native-logs';
import { useApiStore, User, Post } from '../stores/apiStore';

// Configure logger for the example component
const log = logger.createLogger({
  severity: __DEV__ ? logger.consoleTransport.LogLevel.DEBUG : logger.consoleTransport.LogLevel.ERROR,
  transport: logger.consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
});

// Main component demonstrating callback-based API calls with Zustand
const ApiCallbackZustandExample: React.FC = () => {
  // Get state and actions from Zustand store
  const {
    users,
    posts,
    selectedUser,
    loading,
    error,
    fetchUsers,
    fetchUserPosts,
    createPost,
    selectUser,
    clearError,
    clearData,
  } = useApiStore();

  // Action handlers that use Zustand store actions
  const handleFetchUsers = () => {
    log.debug('🔄 [Component] Fetching users...');
    fetchUsers(); // This internally uses callbacks to update Zustand state
  };

  const handleUserSelect = (user: User) => {
    log.debug('👤 [Component] User selected:', user.name);
    selectUser(user);
    fetchUserPosts(user.id); // This internally uses callbacks to update Zustand state
  };

  const handleCreateSamplePost = () => {
    if (!selectedUser) {
      log.warn('⚠️ [Component] No user selected for post creation');
      Alert.alert('Error', 'Please select a user first');
      return;
    }

    const newPost: Omit<Post, 'id'> = {
      title: 'Sample Post from React Native + Zustand',
      body: 'This is a sample post created using callback-based API calls integrated with Zustand state management.',
      userId: selectedUser.id,
    };

    log.debug('✍️ [Component] Creating post for user:', selectedUser.name);
    createPost(newPost); // This internally uses callbacks to update Zustand state
    Alert.alert('Success', 'Post created successfully!');
  };

  const handleClearData = () => {
    log.debug('🗑️ [Component] Clearing all data');
    clearData();
  };

  const handleClearError = () => {
    log.debug('❌ [Component] Clearing error');
    clearError();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔄 API Callback + Zustand Example</Text>
        <Text style={styles.subtitle}>
          Demonstrating callback-based API calls integrated with Zustand state management
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleFetchUsers}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : '👥 Fetch Users'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCreateSamplePost}
            disabled={loading || !selectedUser}
          >
            <Text style={styles.buttonText}>
              ✍️ Create Sample Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearData}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🗑️ Clear Data</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity
              style={styles.clearErrorButton}
              onPress={handleClearError}
            >
              <Text style={styles.clearErrorText}>Clear Error</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Users List */}
        {users.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Users ({users.length})</Text>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userCard,
                  selectedUser?.id === user.id && styles.selectedUserCard
                ]}
                onPress={() => handleUserSelect(user)}
              >
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userCompany}>{user.company.name}</Text>
                {selectedUser?.id === user.id && (
                  <Text style={styles.selectedText}>✅ Selected</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Posts List */}
        {posts.length > 0 && selectedUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📝 Posts by {selectedUser.name} ({posts.length})
            </Text>
            {posts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody} numberOfLines={3}>
                  {post.body}
                </Text>
                <Text style={styles.postId}>Post ID: {post.id}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📖 How to Use</Text>
          <Text style={styles.instruction}>
            1. Tap "Fetch Users" to load users from the API using callbacks + Zustand
          </Text>
          <Text style={styles.instruction}>
            2. Tap on any user to fetch their posts (callback integration)
          </Text>
          <Text style={styles.instruction}>
            3. Tap "Create Sample Post" to create a new post via callback API
          </Text>
          <Text style={styles.instruction}>
            4. Check react-native-logs output for detailed callback logs with [Zustand] prefix
          </Text>
          <Text style={styles.instruction}>
            5. Use Redux DevTools to see Zustand state changes in real-time
          </Text>
        </View>

        {/* Logging Info */}
        <View style={styles.loggingContainer}>
          <Text style={styles.loggingTitle}>📊 Logging with react-native-logs</Text>
          <Text style={styles.loggingText}>
            • Component actions logged with [Component] prefix
          </Text>
          <Text style={styles.loggingText}>
            • Zustand state changes logged with [Zustand] prefix
          </Text>
          <Text style={styles.loggingText}>
            • Different log levels: debug, info, warn, error
          </Text>
          <Text style={styles.loggingText}>
            • Color-coded output for better readability
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: '500',
    marginBottom: 8,
  },
  clearErrorButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
  },
  clearErrorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedUserCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userCompany: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  selectedText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  postCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  postId: {
    fontSize: 12,
    color: '#999',
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  instruction: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
  },
  loggingContainer: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  loggingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#7B1FA2',
  },
  loggingText: {
    fontSize: 14,
    color: '#7B1FA2',
    marginBottom: 4,
  },
});

export default ApiCallbackZustandExample;
