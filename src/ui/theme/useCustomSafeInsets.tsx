import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'

export const useCustomSafeInsets = () => {
  const { bottom, top } = useSafeAreaInsets()
  return {
    bottom: 0.5 * bottom,
    tabBarHeight: 0.5 * bottom + TAB_BAR_COMP_HEIGHT,
    top,
  }
}
