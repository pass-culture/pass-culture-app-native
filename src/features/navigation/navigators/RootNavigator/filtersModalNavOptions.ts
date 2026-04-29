import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

// Simplified for native-stack - uses platform default modal animations
// Custom animations (cardStyleInterpolator, TransitionPresets, etc.) are not supported in native-stack
export const FILTERS_MODAL_NAV_OPTIONS: NativeStackNavigationOptions = {
  // Native-stack will use iOS slide-up and Android fade animations by default
}
