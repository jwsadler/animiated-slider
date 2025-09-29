import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/**
 * SplitView Component
 * 
 * A flexible React Native component that can display child components side by side
 * or stacked vertically with customizable split ratios and styling.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to display
 * @param {'horizontal'|'vertical'} props.direction - Split direction (default: 'horizontal')
 * @param {number[]} props.splitRatio - Array of ratios for each child (default: equal split)
 * @param {number} props.gap - Gap between split sections in pixels (default: 0)
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.sectionStyle - Common styles applied to each section
 * @param {Object[]} props.sectionStyles - Individual styles for each section
 */
const SplitView = ({
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

  const renderChild = (child, index) => {
    const ratio = normalizedRatios[index];
    const isLast = index === childCount - 1;
    
    const childStyle = [
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
    ];

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

SplitView.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  splitRatio: PropTypes.arrayOf(PropTypes.number),
  gap: PropTypes.number,
  style: PropTypes.object,
  sectionStyle: PropTypes.object,
  sectionStyles: PropTypes.arrayOf(PropTypes.object),
};

export default SplitView;
