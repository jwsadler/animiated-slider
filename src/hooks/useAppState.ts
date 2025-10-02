import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// App state types
export type AppStateType = 'active' | 'background' | 'inactive' | 'unknown';

// Extended app state including custom states
export type ExtendedAppState = AppStateType | 'closed' | 'opened';

// App state change event
export interface AppStateChangeEvent {
  previousState: ExtendedAppState;
  currentState: ExtendedAppState;
  timestamp: number;
}

// Hook for app state detection
export const useAppStateDetector = (
  onAppStateChange?: (event: AppStateChangeEvent) => void,
  enableLogging: boolean = false
) => {
  const appState = useRef<ExtendedAppState>(AppState.currentState as AppStateType);
  const previousAppState = useRef<ExtendedAppState>('unknown');

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    const currentState = nextAppState as AppStateType;
    const prevState = appState.current;
    
    // Detect app opened (background/inactive -> active)
    let extendedCurrentState: ExtendedAppState = currentState;
    if (currentState === 'active' && (prevState === 'background' || prevState === 'inactive' || prevState === 'unknown')) {
      extendedCurrentState = 'opened';
    }
    
    // Detect app closed (active -> background with specific conditions)
    if (currentState === 'background' && prevState === 'active') {
      extendedCurrentState = 'closed';
    }

    if (enableLogging) {
      console.log(`[AppStateDetector] State change: ${prevState} -> ${extendedCurrentState}`);
    }

    const event: AppStateChangeEvent = {
      previousState: prevState,
      currentState: extendedCurrentState,
      timestamp: Date.now(),
    };

    previousAppState.current = prevState;
    appState.current = extendedCurrentState;

    onAppStateChange?.(event);
  }, [onAppStateChange, enableLogging]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [handleAppStateChange]);

  return {
    currentState: appState.current,
    previousState: previousAppState.current,
  };
};
