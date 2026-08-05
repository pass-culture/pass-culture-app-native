import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

/**
 * Hook used to adapt useSafeAreaInsets to the applications needs
 * We only want to use 50% of what the libs calls a safe bottom inset
 * We compute the total height of the navbar here as well
 */
export const useCustomSafeInsets = () => {
  const { bottom, top, right, left } = useSafeAreaInsets()
  const {
    tabBar: { height },
  } = useTheme()
  const computedBottomInset = Platform.OS === 'android' ? bottom : 0.5 * bottom

  return {
    bottom: computedBottomInset,
    tabBarHeight: computedBottomInset + height,
    top,
    right,
    left,
  }
}
