import { useTheme } from 'styled-components/native'

import { LocationMode } from 'features/location/enums'
import { isCurrentLocationMode } from 'features/location/helpers/locationHelpers'

export const useGeolocationModeColor = (selectedLocationMode: LocationMode) => {
  const theme = useTheme()

  return isCurrentLocationMode(selectedLocationMode, LocationMode.GEOLOCATION)
    ? theme.colors.primary
    : theme.colors.black
}
