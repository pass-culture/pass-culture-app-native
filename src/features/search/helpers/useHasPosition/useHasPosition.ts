import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

// TODO(PC-25239): after removing location feature flag this should be deleted
export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { geolocPosition } = useLocation()

  const isEverywhereSearch =
    searchState.locationFilter?.locationType === LocationMode.EVERYWHERE && !searchState.venue
  const isGeolocatedUser = !!geolocPosition

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
