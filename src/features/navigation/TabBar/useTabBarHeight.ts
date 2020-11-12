import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TAB_BAR_COMP_HEIGHT } from './TabBarComponent'

export const useTabBarHeight = () => {
  const { bottom: safeHeight } = useSafeAreaInsets()

  return safeHeight + TAB_BAR_COMP_HEIGHT
}
