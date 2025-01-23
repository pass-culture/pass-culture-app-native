import { LocationMode, Position } from 'libs/location/types'
import { formatDistance } from 'libs/parsers/formatDistance'
import { SuggestedPlace } from 'libs/place/types'

export type userProps = {
  userLocation: Position
  selectedPlace: SuggestedPlace | null
  selectedLocationMode: LocationMode
}

export const getDistance = (
  offerPosition: {
    lat?: number | null
    lng?: number | null
  },
  user: userProps
): string | undefined => {
  if (!user.userLocation) return undefined
  if (
    user.selectedLocationMode === LocationMode.AROUND_PLACE &&
    (user.selectedPlace?.type == 'municipality' || user.selectedPlace?.type == 'locality')
  ) {
    return undefined
  }
  return formatDistance(offerPosition, user.userLocation)
}
