import { useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userPosition, place } = useLocation()
  if (!userPosition && !place) return undefined
  return formatDistance(offerPosition, place ? place.geolocation : userPosition)
}
