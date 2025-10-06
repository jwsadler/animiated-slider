import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Props interface for consistent icon styling
interface IconProps {
  color?: string;
  size?: number;
}

// Auction/Hammer Icon
export const AuctionIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.5 2L8.5 3H4V5H20V3H15.5L14.5 2H9.5ZM6 7V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6ZM8 9H10V19H8V9ZM14 9H16V19H14V9Z"
      fill={color}
    />
    <Path
      d="M21 6L19 8L17 6L15 8L13 6L11 8L9 6L7 8L5 6L3 8L1 6V4L3 6L5 4L7 6L9 4L11 6L13 4L15 6L17 4L19 6L21 4V6Z"
      fill={color}
    />
  </Svg>
);

// Payment/Credit Card Icon
export const PaymentIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M2 10h20" stroke={color} strokeWidth="2"/>
    <Path d="M6 14h4" stroke={color} strokeWidth="2"/>
    <Path d="M6 17h2" stroke={color} strokeWidth="2"/>
  </Svg>
);

// Profile/User Icon
export const ProfileIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

// Settings/Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <Path
      d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 9.5m-14 5L7.5 16.5m0-9L5 5.5m14 14L16.5 16.5"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// Home Icon
export const HomeIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2"/>
  </Svg>
);

// Heart/Favorites Icon
export const HeartIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

// Shopping Cart Icon
export const CartIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="21" r="1" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="20" cy="21" r="1" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export default {
  AuctionIcon,
  PaymentIcon,
  ProfileIcon,
  SettingsIcon,
  HomeIcon,
  SearchIcon,
  HeartIcon,
  CartIcon,
};
