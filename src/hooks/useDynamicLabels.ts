import { useState, useEffect, useCallback } from 'react';
import DynamicLabelsService, { Labels, getDynamicLabels } from '../services/DynamicLabelsService';

// Note: This currently uses a mock Firebase implementation
// No Firebase packages are required - it works out of the box!

// Hook for using dynamic labels in components
export const useDynamicLabels = () => {
  const [labels, setLabels] = useState<Labels>(getDynamicLabels().getLabels());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const labelsService = getDynamicLabels();

    // Initialize the service
    const initializeService = async () => {
      try {
        await labelsService.initialize();
      } catch (error) {
        console.error('Failed to initialize labels service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to label updates
    const unsubscribe = labelsService.subscribe((updatedLabels) => {
      console.log('📱 Component received label update');
      setLabels(updatedLabels);
      setIsLoading(false);
    });

    initializeService();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Helper function to get a specific label with interpolation
  const getLabel = useCallback((path: string, interpolations?: Record<string, string | number>): string => {
    return getDynamicLabels().getLabel(path, interpolations);
  }, []);

  return {
    labels,
    getLabel,
    isLoading,
  };
};

// Hook for getting a specific label (useful for single labels)
export const useLabel = (path: string, interpolations?: Record<string, string | number>) => {
  const { getLabel, isLoading } = useDynamicLabels();
  const [label, setLabel] = useState<string>(getLabel(path, interpolations));

  useEffect(() => {
    const labelsService = getDynamicLabels();
    
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
export const useLabels = (paths: string[]) => {
  const { getLabel, isLoading } = useDynamicLabels();
  const [labelValues, setLabelValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    paths.forEach(path => {
      initial[path] = getLabel(path);
    });
    return initial;
  });

  useEffect(() => {
    const labelsService = getDynamicLabels();
    
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

export default useDynamicLabels;
