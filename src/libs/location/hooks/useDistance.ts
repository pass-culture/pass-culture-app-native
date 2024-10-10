import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { formatDistance } from 'libs/parsers/formatDistance'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  if (!userLocation) return undefined
  if (
    selectedLocationMode === LocationMode.AROUND_PLACE &&
    (selectedPlace?.type == 'municipality' || selectedPlace?.type == 'locality')
  ) {
    return undefined
  }
  return formatDistance(offerPosition, userLocation)
}
