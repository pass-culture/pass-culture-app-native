import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export const SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  // @ts-expect-error - cardStyle is web-specific
  cardStyle: {
    flex: 1,
  },
}
