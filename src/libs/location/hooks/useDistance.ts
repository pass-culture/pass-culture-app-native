import { useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userPosition, customPosition, isCustomPosition } = useLocation()
  if (!userPosition && !customPosition) return undefined
  return formatDistance(offerPosition, isCustomPosition ? customPosition : userPosition)
}
