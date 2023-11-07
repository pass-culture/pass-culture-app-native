import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocation } from 'libs/geolocation'

export type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
}

export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { isGeolocated, isCustomPosition, userPosition, place } = useLocation()
  const title = getLocationTitle(place, userPosition)
  const isWidgetHighlighted = isGeolocated || !!isCustomPosition
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId }
}
