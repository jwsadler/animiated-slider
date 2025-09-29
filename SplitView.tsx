import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';

export type SplitDirection = 'horizontal' | 'vertical';

export interface SplitViewProps extends Omit<ViewProps, 'style'> {
  /** Child components to display in the split view */
  children: React.ReactNode;
  /** Direction of the split (default: 'horizontal') */
  direction?: SplitDirection;
  /** Array of ratios for each child (default: equal split) */
  splitRatio?: number[];
  /** Gap between split sections in pixels (default: 0) */
  gap?: number;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Common styles applied to each section */
  sectionStyle?: ViewStyle;
  /** Individual styles for each section */
  sectionStyles?: ViewStyle[];
}

/**
 * SplitView Component
 * 
 * A flexible React Native component that can display child components side by side
 * or stacked vertically with customizable split ratios and styling.
 */
const SplitView: React.FC<SplitViewProps> = ({
  children,
  direction = 'horizontal',
  splitRatio,
  gap = 0,
  style,
  sectionStyle,
  sectionStyles = [],
  ...otherProps
}) => {
  const childrenArray = React.Children.toArray(children);
  const childCount = childrenArray.length;

  // Calculate split ratios
  const ratios = splitRatio || Array(childCount).fill(1 / childCount);
  
  // Ensure ratios sum to 1
  const ratioSum = ratios.reduce((sum, ratio) => sum + ratio, 0);
  const normalizedRatios = ratios.map(ratio => ratio / ratioSum);

  // Calculate total gap space
  const totalGap = gap * (childCount - 1);

  const containerStyle = [
    styles.container,
    direction === 'horizontal' ? styles.horizontal : styles.vertical,
    style,
  ];

  const renderChild = (child: React.ReactNode, index: number): React.ReactElement => {
    const ratio = normalizedRatios[index];
    const isLast = index === childCount - 1;
    
    const childStyle: ViewStyle[] = [
      styles.section,
      direction === 'horizontal' 
        ? { 
            flex: ratio,
            marginRight: isLast ? 0 : gap,
          }
        : { 
            flex: ratio,
            marginBottom: isLast ? 0 : gap,
          },
      sectionStyle,
      sectionStyles[index],
    ].filter(Boolean);

    return (
      <View key={index} style={childStyle}>
        {child}
      </View>
    );
  };

  return (
    <View style={containerStyle} {...otherProps}>
      {childrenArray.map(renderChild)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  section: {
    // Base section styles - can be overridden
  },
});

export default SplitView;
