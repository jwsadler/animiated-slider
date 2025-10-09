import { useState, useEffect, useCallback } from 'react';
import FirebaseDynamicLabelsService, { Labels, getFirebaseDynamicLabels } from '../services/FirebaseDynamicLabelsService';

// Firebase-enabled hook for using dynamic labels in components
// This version uses actual Firebase Realtime Database for real-time updates

// Hook for using dynamic labels in components
export const useFirebaseDynamicLabels = () => {
  const [labels, setLabels] = useState<Labels>(getFirebaseDynamicLabels().getLabels());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const labelsService = getFirebaseDynamicLabels();

    // Initialize the service
    const initializeService = async () => {
      try {
        await labelsService.initialize();
      } catch (error) {
        console.error('Failed to initialize Firebase labels service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to label updates
    const unsubscribe = labelsService.subscribe((updatedLabels) => {
      console.log('📱 Component received Firebase label update');
      setLabels(updatedLabels);
      setIsLoading(false);
    });

    initializeService();

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      // Note: We don't call cleanup() here as other components might be using the service
    };
  }, []);

  // Helper function to get a specific label with interpolation
  const getLabel = useCallback((path: string, interpolations?: Record<string, string | number>): string => {
    return getFirebaseDynamicLabels().getLabel(path, interpolations);
  }, []);

  // Helper function to update labels in Firebase
  const updateLabels = useCallback(async (newLabels: Partial<Labels>): Promise<void> => {
    return getFirebaseDynamicLabels().updateLabels(newLabels);
  }, []);

  return {
    labels,
    getLabel,
    updateLabels,
    isLoading,
  };
};

// Hook for getting a specific label (useful for single labels)
export const useFirebaseLabel = (path: string, interpolations?: Record<string, string | number>) => {
  const { getLabel, isLoading } = useFirebaseDynamicLabels();
  const [label, setLabel] = useState<string>(getLabel(path, interpolations));

  useEffect(() => {
    const labelsService = getFirebaseDynamicLabels();
    
    const unsubscribe = labelsService.subscribe(() => {
      setLabel(getLabel(path, interpolations));
    });

    return unsubscribe;
  }, [path, interpolations, getLabel]);

  return {
    label,
    isLoading,
  };
};

// Hook for getting multiple specific labels
export const useFirebaseLabels = (paths: string[]) => {
  const { getLabel, isLoading } = useFirebaseDynamicLabels();
  const [labelValues, setLabelValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    paths.forEach(path => {
      initial[path] = getLabel(path);
    });
    return initial;
  });

  useEffect(() => {
    const labelsService = getFirebaseDynamicLabels();
    
    const unsubscribe = labelsService.subscribe(() => {
      const updated: Record<string, string> = {};
      paths.forEach(path => {
        updated[path] = getLabel(path);
      });
      setLabelValues(updated);
    });

    return unsubscribe;
  }, [paths, getLabel]);

  return {
    labels: labelValues,
    isLoading,
  };
};

export default useFirebaseDynamicLabels;
