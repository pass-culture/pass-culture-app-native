import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { Position, useLocation } from 'libs/location'

type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
  geolocPosition: Position
}

export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { hasGeolocPosition, geolocPosition, place } = useLocation()
  const title = getLocationTitle(place, geolocPosition)
  const isWidgetHighlighted = hasGeolocPosition || !!place
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId, geolocPosition }
}
