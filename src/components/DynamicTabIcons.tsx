import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Props interface for dynamic icon styling
interface DynamicIconProps {
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  size?: number;
}

// Dynamic Auction Icon that responds to active state
export const DynamicAuctionIcon: React.FC<DynamicIconProps> = ({ 
  isActive, 
  activeColor, 
  inactiveColor, 
  size = 24 
}) => {
  const color = isActive ? activeColor : inactiveColor;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.5 2L12.5 3H8V5H24V3H19.5L18.5 2H13.5ZM10 7V19C10 20.1 10.9 21 12 21H20C21.1 21 22 20.1 22 19V7H10ZM12 9H14V19H12V9ZM18 9H20V19H18V9Z"
        fill={color}
        fillOpacity={isActive ? 1 : 0.8}
      />
      <Path
        d="M8.5 1L7 3L5.5 1L4 3L2.5 1L1 3V5L2.5 3L4 5L5.5 3L7 5L8.5 3L10 5V3L8.5 1Z"
        fill={color}
        fillOpacity={isActive ? 0.8 : 0.6}
      />
    </Svg>
  );
};

// Dynamic Payment Icon
export const DynamicPaymentIcon: React.FC<DynamicIconProps> = ({ 
  isActive, 
  activeColor, 
  inactiveColor, 
  size = 24 
}) => {
  const color = isActive ? activeColor : inactiveColor;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect 
        x="2" 
        y="4" 
        width="20" 
        height="16" 
        rx="2" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2} 
        fill={isActive ? `${color}10` : 'none'}
      />
      <Path d="M2 10h20" stroke={color} strokeWidth={isActive ? 2.5 : 2}/>
      <Path d="M6 14h4" stroke={color} strokeWidth={isActive ? 2 : 1.5}/>
      <Path d="M6 17h2" stroke={color} strokeWidth={isActive ? 2 : 1.5}/>
    </Svg>
  );
};

// Dynamic Profile Icon
export const DynamicProfileIcon: React.FC<DynamicIconProps> = ({ 
  isActive, 
  activeColor, 
  inactiveColor, 
  size = 24 
}) => {
  const color = isActive ? activeColor : inactiveColor;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle 
        cx="12" 
        cy="8" 
        r="4" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2} 
        fill={isActive ? `${color}20` : 'none'}
      />
      <Path 
        d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2}
        fill="none"
      />
    </Svg>
  );
};

// Dynamic Settings Icon
export const DynamicSettingsIcon: React.FC<DynamicIconProps> = ({ 
  isActive, 
  activeColor, 
  inactiveColor, 
  size = 24 
}) => {
  const color = isActive ? activeColor : inactiveColor;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2} 
        fill={isActive ? `${color}30` : 'none'}
      />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth={isActive ? 2 : 1.5}
        fill="none"
      />
    </Svg>
  );
};

// Dynamic Home Icon
export const DynamicHomeIcon: React.FC<DynamicIconProps> = ({ 
  isActive, 
  activeColor, 
  inactiveColor, 
  size = 24 
}) => {
  const color = isActive ? activeColor : inactiveColor;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2} 
        fill={isActive ? `${color}15` : 'none'}
      />
      <Path 
        d="M9 22V12h6v10" 
        stroke={color} 
        strokeWidth={isActive ? 2.5 : 2} 
        fill="none"
      />
    </Svg>
  );
};

export default {
  DynamicAuctionIcon,
  DynamicPaymentIcon,
  DynamicProfileIcon,
  DynamicSettingsIcon,
  DynamicHomeIcon,
};
