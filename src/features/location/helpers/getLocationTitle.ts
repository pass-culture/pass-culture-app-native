import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'

export const getLocationTitle = (place: SuggestedPlace | null, geolocPosition: Position) => {
  if (place) {
    return place.label
  }
  if (geolocPosition !== null) {
    return 'Ma position'
  }
  return 'Me localiser'
}
