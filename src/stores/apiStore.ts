import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { logger } from 'react-native-logs';

// Configure logger for API store
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

// Types for our API responses
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// API service with callback-based methods that integrate with Zustand
export class ApiService {
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

// Zustand store interface
interface ApiState {
  // State
  users: User[];
  posts: Post[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions that use callbacks internally
  fetchUsers: () => void;
  fetchUserPosts: (userId: number) => void;
  createPost: (post: Omit<Post, 'id'>) => void;
  selectUser: (user: User | null) => void;
  clearError: () => void;
  clearData: () => void;
  
  // Internal callback handlers (can be used externally too)
  handleUsersSuccess: (users: User[]) => void;
  handleUsersError: (error: string) => void;
  handlePostsSuccess: (posts: Post[]) => void;
  handlePostsError: (error: string) => void;
  handleCreatePostSuccess: (post: Post) => void;
  handleCreatePostError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

// Zustand store with callback-based API integration
export const useApiStore = create<ApiState>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      posts: [],
      selectedUser: null,
      loading: false,
      error: null,

      // Callback handlers that update Zustand state
      handleUsersSuccess: (users: User[]) => {
        log.info('✅ [Zustand] Users fetched successfully:', users.length);
        set({ users, error: null }, false, 'handleUsersSuccess');
      },

      handleUsersError: (error: string) => {
        log.error('❌ [Zustand] Users fetch error:', error);
        set({ error }, false, 'handleUsersError');
      },

      handlePostsSuccess: (posts: Post[]) => {
        log.info('✅ [Zustand] Posts fetched successfully:', posts.length);
        set({ posts, error: null }, false, 'handlePostsSuccess');
      },

      handlePostsError: (error: string) => {
        log.error('❌ [Zustand] Posts fetch error:', error);
        set({ error }, false, 'handlePostsError');
      },

      handleCreatePostSuccess: (createdPost: Post) => {
        log.info('✅ [Zustand] Post created successfully:', createdPost);
        set(
          state => ({ 
            posts: [createdPost, ...state.posts], 
            error: null 
          }),
          false,
          'handleCreatePostSuccess'
        );
      },

      handleCreatePostError: (error: string) => {
        log.error('❌ [Zustand] Create post error:', error);
        set({ error }, false, 'handleCreatePostError');
      },

      setLoading: (loading: boolean) => {
        set({ loading }, false, 'setLoading');
      },

      // Actions that use callback-based API calls
      fetchUsers: () => {
        const { handleUsersSuccess, handleUsersError, setLoading } = get();
        ApiService.fetchUsers(
          handleUsersSuccess,
          handleUsersError,
          setLoading
        );
      },

      fetchUserPosts: (userId: number) => {
        const { handlePostsSuccess, handlePostsError, setLoading } = get();
        ApiService.fetchUserPosts(
          userId,
          handlePostsSuccess,
          handlePostsError,
          setLoading
        );
      },

      createPost: (post: Omit<Post, 'id'>) => {
        const { handleCreatePostSuccess, handleCreatePostError, setLoading } = get();
        ApiService.createPost(
          post,
          handleCreatePostSuccess,
          handleCreatePostError,
          setLoading
        );
      },

      // Simple state actions
      selectUser: (user: User | null) => {
        set({ selectedUser: user }, false, 'selectUser');
      },

      clearError: () => {
        set({ error: null }, false, 'clearError');
      },

      clearData: () => {
        set({
          users: [],
          posts: [],
          selectedUser: null,
          error: null,
        }, false, 'clearData');
      },
    }),
    {
      name: 'api-store', // Name for devtools
    }
  )
);
