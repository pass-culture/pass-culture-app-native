import { Position } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'

export const getLocationTitle = (place: SuggestedPlace | null, userPosition: Position) => {
  if (place !== null) {
    return place.label
  }
  if (userPosition !== null) {
    return 'Ma position'
  }
  return 'Me localiser'
}
