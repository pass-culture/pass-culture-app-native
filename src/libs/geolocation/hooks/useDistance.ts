import { useLocation } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userPosition } = useLocation()
  if (!userPosition) return undefined
  return formatDistance(offerPosition, userPosition)
}
