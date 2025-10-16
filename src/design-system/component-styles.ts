// src/design-system/component-styles.ts
import { designTokens } from './design-tokens';

export const componentStyles = {
  text: {
    variants: {
      h1: {
        fontSize: designTokens.typography.sizes['4xl'],
        fontWeight: designTokens.typography.weights.bold,
        lineHeight:
          designTokens.typography.sizes['4xl'] *
          designTokens.typography.lineHeights.tight,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: designTokens.typography.sizes['3xl'],
        fontWeight: designTokens.typography.weights.bold,
        lineHeight:
          designTokens.typography.sizes['3xl'] *
          designTokens.typography.lineHeights.tight,
        letterSpacing: -0.5,
      },
      h3: {
        fontSize: designTokens.typography.sizes['2xl'],
        fontWeight: designTokens.typography.weights.semibold,
        lineHeight:
          designTokens.typography.sizes['2xl'] *
          designTokens.typography.lineHeights.normal,
      },
      h4: {
        fontSize: designTokens.typography.sizes.xl,
        fontWeight: designTokens.typography.weights.semibold,
        lineHeight:
          designTokens.typography.sizes.xl *
          designTokens.typography.lineHeights.normal,
      },
      h5: {
        fontSize: designTokens.typography.sizes.lg,
        fontWeight: designTokens.typography.weights.medium,
        lineHeight:
          designTokens.typography.sizes.lg *
          designTokens.typography.lineHeights.normal,
      },
      h6: {
        fontSize: designTokens.typography.sizes.base,
        fontWeight: designTokens.typography.weights.medium,
        lineHeight:
          designTokens.typography.sizes.base *
          designTokens.typography.lineHeights.normal,
      },
      body1: {
        fontSize: designTokens.typography.sizes.base,
        fontWeight: designTokens.typography.weights.normal,
        lineHeight:
          designTokens.typography.sizes.base *
          designTokens.typography.lineHeights.relaxed,
      },
      body2: {
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.normal,
        lineHeight:
          designTokens.typography.sizes.sm *
          designTokens.typography.lineHeights.relaxed,
      },
      caption: {
        fontSize: designTokens.typography.sizes.xs,
        fontWeight: designTokens.typography.weights.normal,
        lineHeight:
          designTokens.typography.sizes.xs *
          designTokens.typography.lineHeights.normal,
      },
      label: {
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.medium,
        lineHeight:
          designTokens.typography.sizes.sm *
          designTokens.typography.lineHeights.normal,
      },
      button: {
        fontSize: designTokens.typography.sizes.base,
        fontWeight: designTokens.typography.weights.semibold,
        lineHeight:
          designTokens.typography.sizes.base *
          designTokens.typography.lineHeights.normal,
        letterSpacing: 0.5,
      },
      buttonSmall: {
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.medium,
        lineHeight:
          designTokens.typography.sizes.sm *
          designTokens.typography.lineHeights.normal,
      },
      buttonMedium: {
        fontSize: designTokens.typography.sizes.base,
        fontWeight: designTokens.typography.weights.semibold,
        lineHeight:
          designTokens.typography.sizes.base *
          designTokens.typography.lineHeights.normal,
        letterSpacing: 0.5,
      },
      buttonLarge: {
        fontSize: designTokens.typography.sizes.lg,
        fontWeight: designTokens.typography.weights.semibold,
        lineHeight:
          designTokens.typography.sizes.lg *
          designTokens.typography.lineHeights.normal,
        letterSpacing: 0.5,
      },
      display1: {
        fontSize: designTokens.typography.sizes['5xl'],
        fontWeight: designTokens.typography.weights.bold,
        lineHeight:
          designTokens.typography.sizes['5xl'] *
          designTokens.typography.lineHeights.tight,
        letterSpacing: -0.8,
      },
      display2: {
        fontSize: 42,
        fontWeight: designTokens.typography.weights.bold,
        lineHeight: 42 * designTokens.typography.lineHeights.tight,
        letterSpacing: -0.6,
      },
      display3: {
        fontSize: designTokens.typography.sizes['8xl'],
        fontWeight: designTokens.typography.weights.black,
        lineHeight: designTokens.typography.sizes['8xl'] * 1,
        letterSpacing: -0.4,
      },
    },
    colors: {
      primary: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[600],
      tertiary: designTokens.colors.neutral[400],
      inverse: designTokens.colors.neutral[0],
      disabled: designTokens.colors.neutral[300],
      error: designTokens.colors.error,
      success: designTokens.colors.success,
      warning: designTokens.colors.warning,
      active: designTokens.colors.primary[600],
      inActive: designTokens.colors.neutral[450],
    },
  },

  button: {
    base: {
      borderRadius: designTokens.borderRadius.full, // Changed to full for pill-like appearance
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      // Enhanced shadow for better visual hierarchy
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    variants: {
      primary: {
        backgroundColor: designTokens.colors.neutral[900], // Changed to match wireframe dark button
        textColor: designTokens.colors.neutral[0],
        // Additional shadow for primary button prominence
        shadowColor: designTokens.colors.neutral[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
      },
      secondary: {
        backgroundColor: designTokens.colors.neutral[100],
        textColor: designTokens.colors.neutral[900],
        borderWidth: 1,
        borderColor: designTokens.colors.neutral[300],
        // Lighter shadow for secondary
        shadowOpacity: 0.1,
        elevation: 2,
      },
      outline: {
        backgroundColor: 'transparent',
        textColor: designTokens.colors.primary[500],
        borderWidth: 1,
        borderColor: designTokens.colors.primary[500],
        // Minimal shadow for outline
        shadowOpacity: 0.05,
        elevation: 1,
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: designTokens.colors.primary[500],
        // No shadow for ghost
        shadowOpacity: 0,
        elevation: 0,
      },
    },
    sizes: {
      small: {
        paddingHorizontal: designTokens.spacing.lg, // Increased padding for better proportions
        paddingVertical: designTokens.spacing.sm,
        minHeight: 40, // Slightly increased for better touch target
      },
      medium: {
        paddingHorizontal: designTokens.spacing.xl,
        paddingVertical: designTokens.spacing.md,
        minHeight: 52, // Increased for wireframe matching
      },
      large: {
        paddingHorizontal: designTokens.spacing['2xl'], // More generous padding
        paddingVertical: designTokens.spacing.lg,
        minHeight: 60, // Larger for prominent CTAs
      },
    },
    states: {
      disabled: {
        backgroundColor: designTokens.colors.neutral[200],
        textColor: designTokens.colors.neutral[400],
        shadowOpacity: 0,
        elevation: 0,
        borderColor: designTokens.colors.neutral[200], // Ensure border color changes too
      },
    },
    colors: {
      active: designTokens.colors.primary[600],
      inActive: designTokens.colors.neutral[450],
      disabled: designTokens.colors.neutral[300],
    },
  },

  card: {
    base: {},
    colors: {
      active: designTokens.colors.primary[600],
      inActive: designTokens.colors.neutral[450],
      disabled: designTokens.colors.neutral[300],
      activeBackground: designTokens.colors.neutral[200],
    },
  },
  form: {
    colors: {
      link: designTokens.colors.primary[500],
      active: designTokens.colors.primary[600],
      inActive: designTokens.colors.neutral[450],
      disabled: designTokens.colors.neutral[300],
      activeBackground: designTokens.colors.neutral[200],
    },
  },
} as const;
