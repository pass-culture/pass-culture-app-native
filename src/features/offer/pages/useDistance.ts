import { useGeolocation } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'

export const useDistance = (offerPosition: {
  lat: number | undefined
  lng: number | undefined
}): string | undefined | null => {
  const userPosition = useGeolocation()
  if (!userPosition || !offerPosition) return null
  return formatDistance(offerPosition, userPosition)
}
