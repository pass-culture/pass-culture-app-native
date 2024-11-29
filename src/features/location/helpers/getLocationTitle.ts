import { LocationLabel, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

export const getLocationTitle = (place: SuggestedPlace | null, locationMode: LocationMode) => {
  switch (locationMode) {
    case LocationMode.AROUND_PLACE:
      return place?.label ?? ''
    case LocationMode.EVERYWHERE:
      return LocationLabel.everywhereLabel
    case LocationMode.AROUND_ME:
      return LocationLabel.aroundMeLabel

    default:
      return LocationLabel.everywhereLabel
  }
}
