import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TAB_BAR_COMP_HEIGHT } from './constants'

/**
 * Hook used to adapt useSafeAreaInsets to the applications needs
 * We only want to use 50% of what the libs calls a safe bottom inset
 * We compute the total height of the navbar here as well
 */
export const useCustomSafeInsets = () => {
  const { bottom, top } = useSafeAreaInsets()
  return {
    bottom: 0.5 * bottom,
    tabBarHeight: 0.5 * bottom + TAB_BAR_COMP_HEIGHT,
    top,
  }
}
