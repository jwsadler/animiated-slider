import { logger } from 'react-native-logs';
import sampleInterests from '../data/sampleInterests.json';

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

// Interest interface (assuming this matches your Interest type)
export interface Interest {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export class InterestApiService {
  // Simulate API delay for realistic loading experience
  private static simulateDelay = (ms: number = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Simulate network failure for testing error handling
  private static shouldSimulateError = (): boolean => {
    // 10% chance of simulated error in development
    return __DEV__ && Math.random() < 0.1;
  };

  static async fetchInterests(
    onSuccess: (interests: Interest[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.info('📥 [InterestApiService] Loading interests from local data...');

      // Simulate network delay
      await this.simulateDelay(800);

      // Simulate occasional network errors for testing
      if (this.shouldSimulateError()) {
        throw new Error('Simulated network error for testing');
      }

      // Load interests from local JSON file
      const interests: Interest[] = sampleInterests as Interest[];
      
      log.info('✅ [InterestApiService] Interests loaded successfully:', interests.length);
      onLoading?.(false);
      onSuccess(interests);

    } catch (error) {
      log.error('❌ [InterestApiService] Failed to fetch interests:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch interests';
      
      onError(errorMessage);
    }
  }

  // Additional method to get a specific interest by ID
  static async fetchInterestById(
    id: string,
    onSuccess: (interest: Interest | null) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🔍 [InterestApiService] Fetching interest by ID:', id);

      // Simulate network delay
      await this.simulateDelay(300);

      // Find interest by ID
      const interests: Interest[] = sampleInterests as Interest[];
      const interest = interests.find(i => i.id === id) || null;

      if (interest) {
        log.info('✅ [InterestApiService] Interest found:', interest.name);
      } else {
        log.warn('⚠️ [InterestApiService] Interest not found for ID:', id);
      }

      onLoading?.(false);
      onSuccess(interest);

    } catch (error) {
      log.error('❌ [InterestApiService] Failed to fetch interest by ID:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch interest';
      
      onError(errorMessage);
    }
  }

  // Method to search interests by name
  static async searchInterests(
    query: string,
    onSuccess: (interests: Interest[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🔍 [InterestApiService] Searching interests with query:', query);

      // Simulate network delay
      await this.simulateDelay(500);

      // Filter interests by name or description
      const interests: Interest[] = sampleInterests as Interest[];
      const filteredInterests = interests.filter(interest =>
        interest.name.toLowerCase().includes(query.toLowerCase()) ||
        (interest.description && interest.description.toLowerCase().includes(query.toLowerCase()))
      );

      log.info('✅ [InterestApiService] Search completed. Found:', filteredInterests.length, 'results');
      onLoading?.(false);
      onSuccess(filteredInterests);

    } catch (error) {
      log.error('❌ [InterestApiService] Failed to search interests:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to search interests';
      
      onError(errorMessage);
    }
  }

  // Method to get random interests (useful for recommendations)
  static async getRandomInterests(
    count: number = 5,
    onSuccess: (interests: Interest[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    try {
      onLoading?.(true);
      log.debug('🎲 [InterestApiService] Getting random interests, count:', count);

      // Simulate network delay
      await this.simulateDelay(400);

      // Get random interests
      const interests: Interest[] = sampleInterests as Interest[];
      const shuffled = [...interests].sort(() => 0.5 - Math.random());
      const randomInterests = shuffled.slice(0, Math.min(count, interests.length));

      log.info('✅ [InterestApiService] Random interests selected:', randomInterests.length);
      onLoading?.(false);
      onSuccess(randomInterests);

    } catch (error) {
      log.error('❌ [InterestApiService] Failed to get random interests:', error);
      onLoading?.(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to get random interests';
      
      onError(errorMessage);
    }
  }
}
