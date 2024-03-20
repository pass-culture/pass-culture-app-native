import { useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userLocation } = useLocation()
  if (!userLocation) return undefined
  return formatDistance(offerPosition, userLocation)
}
