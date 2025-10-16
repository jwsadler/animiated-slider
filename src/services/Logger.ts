import {
  logger as rnLogger,
  configLoggerType,
  consoleTransport,
} from 'react-native-logs';
// Remove crashlytics import to avoid Firebase dependency
// import crashlytics from '@react-native-firebase/crashlytics';
import { LOG_LEVEL, NODE_ENV } from '@env';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Log context for better debugging
export interface LogContext {
  userId?: string;
  feature?: string;
  action?: string;
  [key: string]: any;
}

class LoggerService {
  private rnLogger: any;
  private isDevelopment: boolean;
  private crashlyticsEnabled: boolean = false;

  constructor() {
    this.isDevelopment = NODE_ENV === 'development';
    this.initializeLogger();
  }

  private initializeLogger() {
    const defaultConfig: configLoggerType<typeof consoleTransport, LogLevel> = {
      severity: this.isDevelopment
        ? LogLevel.DEBUG
        : (LOG_LEVEL as LogLevel) || LogLevel.INFO,
      transport: consoleTransport,
      transportOptions: {
        colors: {
          info: 'blueBright',
          warn: 'yellowBright',
          error: 'redBright',
        },
      },
    };

    this.rnLogger = rnLogger.createLogger(defaultConfig);
  }

  /**
   * Enable Crashlytics after Firebase is initialized
   */
  enableCrashlytics() {
    try {
      // Dynamically import crashlytics only when needed
      const crashlytics = require('@react-native-firebase/crashlytics').default;
      this.crashlyticsEnabled = true;
      this.info('LoggerService', 'Crashlytics enabled');
    } catch (error) {
      this.warn(
        'LoggerService',
        'Failed to enable Crashlytics - Firebase may not be initialized',
      );
    }
  }

  /**
   * Send log to Crashlytics if available
   */
  private sendToCrashlytics(message: string, isError: boolean = false) {
    if (!this.crashlyticsEnabled || this.isDevelopment) {
      return;
    }

    try {
      const crashlytics = require('@react-native-firebase/crashlytics').default;
      crashlytics().log(message);
    } catch (error) {
      // Silently fail if crashlytics is not available
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(componentName: string, message: string, context?: LogContext) {
    this.rnLogger.debug(this.formatMessage(componentName, message, context));
  }

  /**
   * Info level logging
   */
  info(componentName: string, message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(componentName, message, context);
    this.rnLogger.info(formattedMessage);

    // Send to Crashlytics in production
    if (!this.isDevelopment) {
      this.sendToCrashlytics(formattedMessage);
    }
  }

  /**
   * Warning level logging
   */
  warn(componentName: string, message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(componentName, message, context);
    this.rnLogger.warn(formattedMessage);

    // Send to Crashlytics
    this.sendToCrashlytics(`WARN: ${formattedMessage}`);
  }

  /**
   * Error level logging
   */
  error(componentName: string, message: string, error?: Error, context?: LogContext) {
    const errorMessage = this.formatMessage(componentName, message, context);
    this.rnLogger.error(errorMessage, error);

    // Send to Crashlytics
    if (this.crashlyticsEnabled) {
      try {
        const crashlytics =
          require('@react-native-firebase/crashlytics').default;
        if (error) {
          crashlytics().recordError(error);
        } else {
          crashlytics().log(`ERROR: ${errorMessage}`);
        }
      } catch (crashlyticsError) {
        // Silently fail
      }
    }
  }

  // IMPLEMENT CRITICAL ERROR LOGGING FOR EXTREME CASES
  critical(componentName: string, message: string, error?: Error, context?: LogContext) {
    const errorMessage = this.formatMessage(componentName, message, context);
    this.rnLogger.error(`CRITICAL: ${errorMessage}`, error);

    // Send to Crashlytics
    if (this.crashlyticsEnabled) {
      try {
        const crashlytics =
          require('@react-native-firebase/crashlytics').default;
        if (error) {
          crashlytics().recordError(error);
        }
        crashlytics().log(`CRITICAL: ${errorMessage}`);
        crashlytics().sendUnsentReports();
      }
      catch (crashlyticsError) {
        // Silently fail
      }
    }
  }

  /**
   * Log app state change
   */
  stateChange = (previous: string, current: string, context?: LogContext) => {
    const logContext = { ...context, previous, current };
    this.info(
      'AppStateDetector',
      `State change: ${previous} -> ${current}`,
      logContext,
    );
  };

  /**
   * Log user actions for analytics
   */
  userAction(componentName: string, action: string, context?: LogContext) {
    const logContext = { ...context, action };
    this.info(componentName, `User Action: ${action}`, logContext);
  }

  /**
   * Log API calls
   */
  apiCall(componentName: string, method: string, endpoint: string, context?: LogContext) {
    const logContext = { ...context, method, endpoint };
    this.debug(componentName, `API Call: ${method} ${endpoint}`, logContext);
  }

  /**
   * Log API responses
   */
  apiResponse(
    componentName: string,
    method: string,
    endpoint: string,
    success: boolean,
    duration?: number,
    context?: LogContext,
  ) {
    const logContext = { ...context, method, endpoint, success, duration };
    const level = success ? 'info' : 'warn';
    this[level](
      componentName,
      `API Response: ${method} ${endpoint} - ${success ? 'Success' : 'Failed'}`,
      logContext,
    );
  }

  /**
   * Set user context for all logs
   */
  setUserContext(userId: string, userInfo?: Record<string, any>) {
    if (this.crashlyticsEnabled) {
      try {
        const crashlytics =
          require('@react-native-firebase/crashlytics').default;
        crashlytics().setUserId(userId);

        if (userInfo) {
          Object.entries(userInfo).forEach(([key, value]) => {
            crashlytics().setAttribute(key, String(value));
          });
        }
      } catch (error) {
        // Silently fail
      }
    }

    this.info('LoggerService', 'User context set', { userId, ...userInfo });
  }

  /**
   * Clear user context (on logout)
   */
  clearUserContext() {
    if (this.crashlyticsEnabled) {
      try {
        const crashlytics =
          require('@react-native-firebase/crashlytics').default;
        crashlytics().setUserId('');
      } catch (error) {
        // Silently fail
      }
    }
    this.info('LoggerService', 'User context cleared');
  }

  private formatMessage(componentName: string, message: string, context?: LogContext): string {
    const baseMessage = `[${componentName}] ${message}`;

    if (!context) return baseMessage;

    const contextString = Object.entries(context)
      .map(
        ([key, value]) =>
          `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`,
      )
      .join(', ');

    return `${baseMessage} | ${contextString}`;
  }
}

// Export singleton instance
export const Logger = new LoggerService();
export default Logger;
