import { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const FLAT_BACKGROUND_HEIGHT = getSpacing(43)

export const useVenueBackgroundStyle = () => {
  const { isDesktopViewport, isTabletViewport, appContentWidth, designSystem } = useTheme()
  const { top } = useCustomSafeInsets()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  return isLargeScreen
    ? { height: 232, width: 375, borderRadius: designSystem.size.borderRadius.s }
    : { height: FLAT_BACKGROUND_HEIGHT + top, width: appContentWidth }
}
