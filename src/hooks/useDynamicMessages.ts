import { useState, useEffect, useCallback } from 'react';
import Logger from '../shared/utils/Logger';
import {
  Configuration,
  DynamicMessage,
  DynamicMessages,
} from '../types/database';
import { getFirebaseDynamicMessages } from '../services/firebase/FirebaseDynamicMessagesService';

// Firebase-enabled hook for using dynamic configuration in components
// This version uses actual Firebase Realtime Database for real-time updates
// Hook for using dynamic configuration in components
export const useFirebaseDynamicMessages = () => {
  const [messages, setMessages] = useState<DynamicMessage[]>(
    getFirebaseDynamicMessages().getMessages(),
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const messagesService = getFirebaseDynamicMessages();
    // Initialize the service
    const initializeService = async () => {
      try {
        await messagesService.initialize();
      } catch (error) {
        Logger.error(
          'DynamicConfigurationHook',
          'Failed to initialize Firebase configuration service:',
          error as Error,
        );
      } finally {
        setIsLoading(false);
      }
    };
    // Subscribe to configuration updates
    const unsubscribe = messagesService.subscribe(updatedConfiguration => {
      Logger.info(
        'DynamicConfigurationHook',
        '📱 Component received Firebase configuration update',
      );
      setMessages(updatedConfiguration);
      setIsLoading(false);
    });
    initializeService();
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      // Note: We don't call cleanup() here as other components might be using the service
    };
  }, []);
  // Helper function to get a specific configuration item with interpolation
  const getMessageItem = useCallback(
    (
      path: string,
      interpolations?: Record<string, string | number>,
    ): string => {
      return getFirebaseDynamicMessages().getMessageItem(path, interpolations);
    },
    [],
  );
  // Helper function to update configuration in Firebase
  const updateConfiguration = useCallback(
    async (newConfiguration: Partial<DynamicMessage[]>): Promise<void> => {
      return getFirebaseDynamicMessages().updateMessages(newConfiguration);
    },
    [],
  );
  return {
    messages,
    getMessageItem,
    updateConfiguration,
    isLoading,
  };
};
// Hook for getting a specific configuration item (useful for single items)
export const useFirebaseConfigurationItem = (
  path: string,
  interpolations?: Record<string, string | number>,
) => {
  const { getMessageItem, isLoading } = useFirebaseDynamicMessages();
  const [label, setLabel] = useState<string>(
    getMessageItem(path, interpolations),
  );
  useEffect(() => {
    const labelsService = getFirebaseDynamicMessages();

    const unsubscribe = labelsService.subscribe(() => {
      setLabel(getMessageItem(path, interpolations));
    });
    return unsubscribe;
  }, [path, interpolations, getMessageItem]);
  return {
    label,
    isLoading,
  };
};
// Hook for getting multiple specific configuration
export const useFirebaseConfiguration = (paths: string[]) => {
  const { getMessageItem: getMessageItem, isLoading } =
    useFirebaseDynamicMessages();
  const [labelValues, setLabelValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    paths.forEach(path => {
      initial[path] = getMessageItem(path);
    });
    return initial;
  });
  useEffect(() => {
    const messagesService = getFirebaseDynamicMessages();

    const unsubscribe = messagesService.subscribe(() => {
      const updated: Record<string, string> = {};
      paths.forEach(path => {
        updated[path] = getMessageItem(path);
      });
      setLabelValues(updated);
    });
    return unsubscribe;
  }, [paths, getMessageItem]);
  return {
    labels: labelValues,
    isLoading,
  };
};
export default useFirebaseDynamicMessages;
