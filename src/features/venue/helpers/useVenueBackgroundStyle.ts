import { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const FLAT_BACKGROUND_HEIGHT = getSpacing(43)

export const useVenueBackgroundStyle = () => {
  const { isDesktopViewport, appContentWidth } = useTheme()
  const { top } = useCustomSafeInsets()

  return isDesktopViewport
    ? { height: 232, width: 375, borderRadius: getSpacing(1) }
    : { height: FLAT_BACKGROUND_HEIGHT + top, width: appContentWidth }
}
