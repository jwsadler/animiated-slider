import React, { useState, useCallback } from 'react';
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

// Types for our API responses
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// API service with callback-based methods
class ApiService {
  private static baseUrl = 'https://jsonplaceholder.typicode.com';

  // Callback-based method to fetch users
  static fetchUsers(
    onSuccess: (users: User[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void
  ) {
    onLoading?.(true);
    
    fetch(`${this.baseUrl}/users`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((users: User[]) => {
        onLoading?.(false);
        onSuccess(users);
      })
      .catch(error => {
        onLoading?.(false);
        onError(error.message || 'Failed to fetch users');
      });
  }

  // Callback-based method to fetch posts by user
  static fetchUserPosts(
    userId: number,
    onSuccess: (posts: Post[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void
  ) {
    onLoading?.(true);
    
    fetch(`${this.baseUrl}/posts?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((posts: Post[]) => {
        onLoading?.(false);
        onSuccess(posts);
      })
      .catch(error => {
        onLoading?.(false);
        onError(error.message || 'Failed to fetch posts');
      });
  }

  // Callback-based method to create a new post
  static createPost(
    post: Omit<Post, 'id'>,
    onSuccess: (createdPost: Post) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void
  ) {
    onLoading?.(true);
    
    fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((createdPost: Post) => {
        onLoading?.(false);
        onSuccess(createdPost);
      })
      .catch(error => {
        onLoading?.(false);
        onError(error.message || 'Failed to create post');
      });
  }
}

// Main component demonstrating callback-based API calls
const ApiCallbackExample: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callback handlers for users
  const handleUsersSuccess = useCallback((fetchedUsers: User[]) => {
    setUsers(fetchedUsers);
    setError(null);
    console.log('✅ Users fetched successfully:', fetchedUsers.length);
  }, []);

  const handleUsersError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    Alert.alert('Error', `Failed to fetch users: ${errorMessage}`);
    console.error('❌ Users fetch error:', errorMessage);
  }, []);

  // Callback handlers for posts
  const handlePostsSuccess = useCallback((fetchedPosts: Post[]) => {
    setPosts(fetchedPosts);
    setError(null);
    console.log('✅ Posts fetched successfully:', fetchedPosts.length);
  }, []);

  const handlePostsError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    Alert.alert('Error', `Failed to fetch posts: ${errorMessage}`);
    console.error('❌ Posts fetch error:', errorMessage);
  }, []);

  // Callback handlers for creating posts
  const handleCreatePostSuccess = useCallback((createdPost: Post) => {
    setPosts(prevPosts => [createdPost, ...prevPosts]);
    setError(null);
    Alert.alert('Success', 'Post created successfully!');
    console.log('✅ Post created successfully:', createdPost);
  }, []);

  const handleCreatePostError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    Alert.alert('Error', `Failed to create post: ${errorMessage}`);
    console.error('❌ Create post error:', errorMessage);
  }, []);

  // Action handlers
  const fetchUsers = () => {
    ApiService.fetchUsers(
      handleUsersSuccess,
      handleUsersError,
      setLoading
    );
  };

  const fetchUserPosts = (user: User) => {
    setSelectedUser(user);
    ApiService.fetchUserPosts(
      user.id,
      handlePostsSuccess,
      handlePostsError,
      setLoading
    );
  };

  const createSamplePost = () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user first');
      return;
    }

    const newPost: Omit<Post, 'id'> = {
      title: 'Sample Post from React Native',
      body: 'This is a sample post created using callback-based API call.',
      userId: selectedUser.id,
    };

    ApiService.createPost(
      newPost,
      handleCreatePostSuccess,
      handleCreatePostError,
      setLoading
    );
  };

  const clearData = () => {
    setUsers([]);
    setPosts([]);
    setSelectedUser(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔄 API Callback Example</Text>
        <Text style={styles.subtitle}>
          Demonstrating callback-based API calls in React Native
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={fetchUsers}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : '👥 Fetch Users'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={createSamplePost}
            disabled={loading || !selectedUser}
          >
            <Text style={styles.buttonText}>
              ✍️ Create Sample Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={clearData}
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
                onPress={() => fetchUserPosts(user)}
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
            1. Tap "Fetch Users" to load users from the API
          </Text>
          <Text style={styles.instruction}>
            2. Tap on any user to fetch their posts
          </Text>
          <Text style={styles.instruction}>
            3. Tap "Create Sample Post" to create a new post for the selected user
          </Text>
          <Text style={styles.instruction}>
            4. Watch the console for detailed callback logs
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
    marginTop: 16,
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
});

export default ApiCallbackExample;
