import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

// Example 1: Basic Pull-to-Refresh with ScrollView
export const BasicPullToRefreshExample: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setData([
        'Item 1 - Updated',
        'Item 2 - Updated', 
        'Item 3 - Updated',
        'Item 4 - Updated',
        'Item 5 - Updated',
      ]);
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Initial load
    onRefresh();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']} // Android
            tintColor="#007AFF" // iOS
            title="Pull to refresh..." // iOS
            titleColor="#007AFF" // iOS
          />
        }
      >
        <Text style={styles.title}>Pull to Refresh Example</Text>
        <Text style={styles.subtitle}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
        
        {data.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Example 2: Pull-to-Refresh with FlatList
export const FlatListPullToRefreshExample: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{ id: string; title: string; subtitle: string }[]>([]);

  const fetchData = useCallback(async () => {
    // Simulate API call
    return new Promise<{ id: string; title: string; subtitle: string }[]>((resolve) => {
      setTimeout(() => {
        const newData = Array.from({ length: 10 }, (_, index) => ({
          id: `${index}`,
          title: `Item ${index + 1}`,
          subtitle: `Updated at ${new Date().toLocaleTimeString()}`,
        }));
        resolve(newData);
      }, 1500);
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const newData = await fetchData();
      setData(newData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderItem = ({ item }: { item: { id: string; title: string; subtitle: string } }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>{item.title}</Text>
      <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF', '#34C759']} // Android - multiple colors
            tintColor="#007AFF" // iOS
            title="Refreshing..." // iOS
            titleColor="#666" // iOS
          />
        }
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

// Example 3: Advanced Pull-to-Refresh with Error Handling
export const AdvancedPullToRefreshExample: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 20% chance of failure for demo
          if (Math.random() < 0.2) {
            reject(new Error('Network error occurred'));
          } else {
            resolve(null);
          }
        }, 2000);
      });

      // Success - update data
      const newData = Array.from({ length: 8 }, (_, index) => ({
        id: `${index}`,
        title: `Data Item ${index + 1}`,
        description: `Loaded at ${new Date().toLocaleString()}`,
        value: Math.floor(Math.random() * 100),
      }));
      
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error && data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF3B30']}
              tintColor="#FF3B30"
              title="Pull to retry..."
              titleColor="#FF3B30"
            />
          }
        >
          <Text style={styles.errorText}>❌ {error}</Text>
          <Text style={styles.errorSubtext}>Pull down to retry</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
            title="Pull to refresh..."
            titleColor="#666"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.advancedItem}>
            <Text style={styles.advancedItemTitle}>{item.title}</Text>
            <Text style={styles.advancedItemDescription}>{item.description}</Text>
            <Text style={styles.advancedItemValue}>Value: {item.value}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Advanced Example</Text>
            {error && (
              <Text style={styles.headerError}>⚠️ Last refresh failed: {error}</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// Example 4: Custom Pull-to-Refresh Colors and Styling
export const CustomStyledPullToRefreshExample: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [data, setData] = useState<string[]>([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    setTimeout(() => {
      setData([
        '🎨 Custom styled refresh',
        '🌈 Multiple colors',
        '📱 Platform specific',
        '⚡ Fast and smooth',
        '🎯 User friendly',
      ]);
      // Toggle theme on refresh for demo
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const isDark = theme === 'dark';
  const containerStyle = [
    styles.container,
    { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }
  ];

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Android colors
            colors={isDark ? ['#FF6B6B', '#4ECDC4', '#45B7D1'] : ['#007AFF', '#34C759', '#FF9500']}
            progressBackgroundColor={isDark ? '#333' : '#fff'}
            // iOS colors
            tintColor={isDark ? '#FF6B6B' : '#007AFF'}
            title={`Pull to refresh (${theme} theme)`}
            titleColor={isDark ? '#fff' : '#666'}
          />
        }
      >
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
          Custom Styled Refresh
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
          Current theme: {theme}
        </Text>
        
        {data.map((item, index) => (
          <View key={index} style={[
            styles.item,
            { backgroundColor: isDark ? '#333' : '#fff' }
          ]}>
            <Text style={[styles.itemText, { color: isDark ? '#fff' : '#333' }]}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    padding: 20,
  },
  flatListContainer: {
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
    marginBottom: 20,
    color: '#666',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  listItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  advancedItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  advancedItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  advancedItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  advancedItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  headerError: {
    fontSize: 14,
    color: '#FF9500',
    textAlign: 'center',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 6,
  },
});

export default {
  BasicPullToRefreshExample,
  FlatListPullToRefreshExample,
  AdvancedPullToRefreshExample,
  CustomStyledPullToRefreshExample,
};
