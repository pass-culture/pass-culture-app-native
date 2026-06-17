import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { useLocationLabel } from 'libs/locationV2/location.store'

type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
}

export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { selectedLocationMode } = useLocation()
  const title = useLocationLabel()
  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId }
}
