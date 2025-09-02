import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
}

export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { selectedLocationMode, place } = useLocation()
  const title = getLocationTitle(place, selectedLocationMode)
  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId }
}
