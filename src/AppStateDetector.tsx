import React, { useCallback } from 'react';
import { useAppStateDetector, AppStateChangeEvent, ExtendedAppState } from './hooks/useAppState';

// Props interface
export interface AppStateDetectorProps {
  onAppStateChange?: (event: AppStateChangeEvent) => void;
  onAppOpened?: () => void;
  onAppClosed?: () => void;
  onAppBackground?: () => void;
  onAppInactive?: () => void;
  onAppActive?: () => void;
  children?: React.ReactNode;
  enableLogging?: boolean;
}

// Main AppStateDetector component
export const AppStateDetector: React.FC<AppStateDetectorProps> = ({
  onAppStateChange,
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
  useAppStateDetector(handleAppStateChange, enableLogging);

  return <>{children}</>;
};

export default AppStateDetector;
