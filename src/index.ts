export { AnimatedSlider, AnimatedSliderProps } from './AnimatedSlider';
export { VerticalAnimatedSlider, VerticalAnimatedSliderProps } from './VerticalAnimatedSlider';
export { BottomTabNavigation, BottomTabNavigationProps, TabConfig } from './BottomTabNavigation';
export { AuctionScreen, AuctionScreenProps, AuctionItem } from './components/AuctionScreen';
export { PaymentScreen, PaymentScreenProps, PaymentMethod } from './components/PaymentScreen';

// Export tab navigation examples
export { default as TabNavigationExample } from './TabNavigationExample';
export { default as TabNavigationWithSVGExample } from './TabNavigationWithSVGExample';
export { default as TabNavigationIconExamples } from './TabNavigationIconExamples';

// Export icon components
export * from './components/TabIcons';
export * from './components/DynamicTabIcons';

// Animated Slider Button
export { default as AnimatedSliderButton, AnimatedSliderButtonProps } from './components/AnimatedSliderButton';
export { default as AnimatedSliderButtonExample } from './examples/AnimatedSliderButtonExample';
// Shows/Auctions Components
export { ShowsApiService, Show } from './services/ShowsApiService';
export { default as ShowsScreen, ShowsScreenProps } from './components/ShowsScreen';
export { default as ShowsScreenExample } from './examples/ShowsScreenExample';

// Shows Icons
export {
  SearchIcon,
  ChatIcon,
  NotificationIcon,
  SoundIcon,
  MuteIcon,
  BookmarkIcon,
  EyeIcon,
  UserIcon,
} from './components/icons/ShowsIcons';

export default AnimatedSlider;
