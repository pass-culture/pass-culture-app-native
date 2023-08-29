import { useGeolocation } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'

export const useDistance = (offerPosition: {
  lat?: number | null
  lng?: number | null
}): string | undefined => {
  const { userPosition } = useGeolocation()
  // TODO(voisinhugo): check if !offerPosition check is useful - add data validation from API if needed
  if (!userPosition || !offerPosition) return undefined
  return formatDistance(offerPosition, userPosition)
}
