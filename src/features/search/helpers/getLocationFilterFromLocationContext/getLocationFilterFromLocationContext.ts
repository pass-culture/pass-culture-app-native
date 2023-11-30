import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'

export const getLocationFilterFromLocationContext = ({
  isGeolocated,
  isCustomPosition = false,
  place,
}: {
  isGeolocated: boolean
  isCustomPosition?: boolean
  place: SuggestedPlace | null
}): LocationFilter => {
  let locationFilter: LocationFilter = { locationType: LocationType.EVERYWHERE }
  if (isCustomPosition && place) {
    locationFilter = {
      place,
      locationType: LocationType.PLACE,
      aroundRadius: DEFAULT_RADIUS,
    }
  } else if (isGeolocated) {
    locationFilter = { locationType: LocationType.AROUND_ME, aroundRadius: DEFAULT_RADIUS }
  }
  return locationFilter
}
