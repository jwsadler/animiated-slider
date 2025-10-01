import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// App state types
export type AppStateType = 'active' | 'background' | 'inactive' | 'unknown';

// Extended app state including custom states
export type ExtendedAppState = AppStateType | 'closed' | 'opened';

// Screen change event
export interface ScreenChangeEvent {
  previousScreen?: string;
  currentScreen: string;
  timestamp: number;
}

// App state change event
export interface AppStateChangeEvent {
  previousState: ExtendedAppState;
  currentState: ExtendedAppState;
  timestamp: number;
}

// Props interface
export interface AppStateDetectorProps {
  onAppStateChange?: (event: AppStateChangeEvent) => void;
  onScreenChange?: (event: ScreenChangeEvent) => void;
  onAppOpened?: () => void;
  onAppClosed?: () => void;
  onAppBackground?: () => void;
  onAppInactive?: () => void;
  onAppActive?: () => void;
  children?: React.ReactNode;
  enableLogging?: boolean;
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

// Hook for screen change detection
export const useScreenChangeDetector = (
  onScreenChange?: (event: ScreenChangeEvent) => void,
  enableLogging: boolean = false
) => {
  const currentScreen = useRef<string>('');
  const previousScreen = useRef<string>('');

  const notifyScreenChange = useCallback((screenName: string) => {
    const prevScreen = currentScreen.current;
    
    if (prevScreen !== screenName) {
      if (enableLogging) {
        console.log(`[ScreenChangeDetector] Screen change: ${prevScreen || 'none'} -> ${screenName}`);
      }

      const event: ScreenChangeEvent = {
        previousScreen: prevScreen || undefined,
        currentScreen: screenName,
        timestamp: Date.now(),
      };

      previousScreen.current = prevScreen;
      currentScreen.current = screenName;

      onScreenChange?.(event);
    }
  }, [onScreenChange, enableLogging]);

  return {
    currentScreen: currentScreen.current,
    previousScreen: previousScreen.current,
    notifyScreenChange,
  };
};

// Main AppStateDetector component
export const AppStateDetector: React.FC<AppStateDetectorProps> = ({
  onAppStateChange,
  onScreenChange,
  onAppOpened,
  onAppClosed,
  onAppBackground,
  onAppInactive,
  onAppActive,
  children,
  enableLogging = false,
}) => {
  // Handle app state changes with specific callbacks
  const handleAppStateChange = useCallback((event: AppStateChangeEvent) => {
    const { currentState } = event;

    // Call specific state callbacks
    switch (currentState) {
      case 'opened':
        onAppOpened?.();
        break;
      case 'closed':
        onAppClosed?.();
        break;
      case 'background':
        onAppBackground?.();
        break;
      case 'inactive':
        onAppInactive?.();
        break;
      case 'active':
        onAppActive?.();
        break;
    }

    // Call general state change callback
    onAppStateChange?.(event);
  }, [onAppStateChange, onAppOpened, onAppClosed, onAppBackground, onAppInactive, onAppActive]);

  // Use the app state detector hook
  const { currentState, previousState } = useAppStateDetector(handleAppStateChange, enableLogging);

  // Use the screen change detector hook
  const { currentScreen, previousScreen, notifyScreenChange } = useScreenChangeDetector(onScreenChange, enableLogging);

  // Provide context to children if needed
  const contextValue = {
    currentAppState: currentState,
    previousAppState: previousState,
    currentScreen,
    previousScreen,
    notifyScreenChange,
  };

  return (
    <AppStateDetectorContext.Provider value={contextValue}>
      {children}
    </AppStateDetectorContext.Provider>
  );
};

// Context for accessing app state detector values
export const AppStateDetectorContext = React.createContext<{
  currentAppState: ExtendedAppState;
  previousAppState: ExtendedAppState;
  currentScreen: string;
  previousScreen: string;
  notifyScreenChange: (screenName: string) => void;
} | null>(null);

// Hook to use the app state detector context
export const useAppStateDetectorContext = () => {
  const context = React.useContext(AppStateDetectorContext);
  if (!context) {
    throw new Error('useAppStateDetectorContext must be used within an AppStateDetector');
  }
  return context;
};

export default AppStateDetector;
