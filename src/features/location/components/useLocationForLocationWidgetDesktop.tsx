import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { Position, useLocation } from 'libs/location'

type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
  userPosition: Position
}

export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { isGeolocated, userPosition, place } = useLocation()
  const title = getLocationTitle(place, userPosition)
  const isWidgetHighlighted = isGeolocated || !!place
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId, userPosition }
}
