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
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M8 12h8" stroke={color} strokeWidth="2"/>
    <Path d="M12 8v8" stroke={color} strokeWidth="2"/>
  </Svg>
);

// Payment/Credit Card Icon
export const PaymentIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="8" width="16" height="10" rx="2" stroke={color} strokeWidth="2"/>
    <Path d="M4 12h16" stroke={color} strokeWidth="2"/>
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
