import React from 'react';

// Props for dynamic icon wrapper
interface DynamicIconWrapperProps {
  children: (props: {
    isActive: boolean;
    activeColor: string;
    inactiveColor: string;
  }) => React.ReactElement;
  isActive?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

// Wrapper component that provides active state to dynamic icons
export const DynamicIconWrapper: React.FC<DynamicIconWrapperProps> = ({
  children,
  isActive = false,
  activeColor = '#007AFF',
  inactiveColor = '#8E8E93',
}) => {
  return children({ isActive, activeColor, inactiveColor });
};

export default DynamicIconWrapper;
