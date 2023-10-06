import { useTheme } from 'styled-components/native'

import { LocationMode } from 'features/location/enums'
import { isCurrentLocationMode } from 'features/location/helpers/locationHelpers'

export const useCustomLocationModeColor = (selectedLocationMode: LocationMode) => {
  const theme = useTheme()

  return isCurrentLocationMode(selectedLocationMode, LocationMode.CUSTOM_POSITION)
    ? theme.colors.primary
    : theme.colors.black
}
