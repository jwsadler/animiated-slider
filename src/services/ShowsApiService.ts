import { logger } from 'react-native-logs';
import sampleShows from '../data/sampleShows.json';

// Configure logger
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

// Show interface
export interface Show {
  id: string;
  title: string;
  nickname: string;
  userIcon?: string; // Optional user avatar/icon URL
  isLive: boolean;
  viewerCount: number;
  scheduledTime: string | null;
  startDate: string; // ISO date string for sorting
  imageUrl: string;
  description: string;
  category: string;
  tags: string[];
}

export class ShowsApiService {
  // Simulate API delay for realistic loading experience
  private static simulateDelay = (ms: number = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Simulate network failure for testing error handling
  private static shouldSimulateError = (): boolean => {
    // 5% chance of simulated error in development
    return __DEV__ && Math.random() < 0.05;
  };

  // Fetch all shows
  static async fetchShows(
    onSuccess: (shows: Show[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.info('📥 [ShowsApiService] Loading shows from local data...');

      // Simulate network delay
      await this.simulateDelay(800);

      // Simulate occasional network errors for testing
      if (this.shouldSimulateError()) {
        throw new Error('Simulated network error for testing');
      }

      // Load shows from local JSON file
      const shows: Show[] = sampleShows as Show[];
      
      // Sort shows by startDate (earliest first)
      const sortedShows = shows.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });
      
      log.info('✅ [ShowsApiService] Shows loaded and sorted successfully:', sortedShows.length);
      onLoading?.(false);
      onSuccess(sortedShows);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to fetch shows:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch shows';
      
      onError(errorMessage);
    }
  }

  // Search shows by query
  static async searchShows(
    query: string,
    onSuccess: (shows: Show[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🔍 [ShowsApiService] Searching shows with query:', query);

      // Simulate network delay
      await this.simulateDelay(500);

      // Simulate occasional network errors for testing
      if (this.shouldSimulateError()) {
        throw new Error('Search service temporarily unavailable');
      }

      // Filter shows by title, nickname, description, category, or tags
      const shows: Show[] = sampleShows as Show[];
      const filteredShows = shows.filter(show => {
        const searchTerm = query.toLowerCase();
        return (
          show.title.toLowerCase().includes(searchTerm) ||
          show.nickname.toLowerCase().includes(searchTerm) ||
          show.description.toLowerCase().includes(searchTerm) ||
          show.category.toLowerCase().includes(searchTerm) ||
          show.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });

      log.info('✅ [ShowsApiService] Search completed. Found:', filteredShows.length, 'results');
      onLoading?.(false);
      onSuccess(filteredShows);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to search shows:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to search shows';
      
      onError(errorMessage);
    }
  }

  // Get show by ID
  static async fetchShowById(
    id: string,
    onSuccess: (show: Show | null) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🔍 [ShowsApiService] Fetching show by ID:', id);

      // Simulate network delay
      await this.simulateDelay(300);

      // Find show by ID
      const shows: Show[] = sampleShows as Show[];
      const show = shows.find(s => s.id === id) || null;

      if (show) {
        log.info('✅ [ShowsApiService] Show found:', show.title);
      } else {
        log.warn('⚠️ [ShowsApiService] Show not found for ID:', id);
      }

      onLoading?.(false);
      onSuccess(show);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to fetch show by ID:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch show';
      
      onError(errorMessage);
    }
  }

  // Get live shows only
  static async fetchLiveShows(
    onSuccess: (shows: Show[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🔴 [ShowsApiService] Fetching live shows only...');

      // Simulate network delay
      await this.simulateDelay(400);

      // Filter for live shows only
      const shows: Show[] = sampleShows as Show[];
      const liveShows = shows.filter(show => show.isLive);

      log.info('✅ [ShowsApiService] Live shows loaded:', liveShows.length);
      onLoading?.(false);
      onSuccess(liveShows);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to fetch live shows:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch live shows';
      
      onError(errorMessage);
    }
  }

  // Get scheduled shows only
  static async fetchScheduledShows(
    onSuccess: (shows: Show[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('📅 [ShowsApiService] Fetching scheduled shows only...');

      // Simulate network delay
      await this.simulateDelay(400);

      // Filter for scheduled shows only
      const shows: Show[] = sampleShows as Show[];
      const scheduledShows = shows.filter(show => !show.isLive && show.scheduledTime);

      log.info('✅ [ShowsApiService] Scheduled shows loaded:', scheduledShows.length);
      onLoading?.(false);
      onSuccess(scheduledShows);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to fetch scheduled shows:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch scheduled shows';
      
      onError(errorMessage);
    }
  }

  // Get shows by category
  static async fetchShowsByCategory(
    category: string,
    onSuccess: (shows: Show[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🏷️ [ShowsApiService] Fetching shows by category:', category);

      // Simulate network delay
      await this.simulateDelay(500);

      // Filter shows by category
      const shows: Show[] = sampleShows as Show[];
      const categoryShows = shows.filter(show => 
        show.category.toLowerCase().includes(category.toLowerCase())
      );

      log.info('✅ [ShowsApiService] Category shows loaded:', categoryShows.length);
      onLoading?.(false);
      onSuccess(categoryShows);

    } catch (error) {
      log.error('❌ [ShowsApiService] Failed to fetch shows by category:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch shows by category';
      
      onError(errorMessage);
    }
  }
}
