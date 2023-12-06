import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { useLocation } from 'libs/location'

// TODO(PC-25239): after removing location feature flag this should be deleted
export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { userPosition: position } = useLocation()

  const isEverywhereSearch =
    searchState.locationFilter?.locationType === LocationType.EVERYWHERE && !searchState.venue
  const isGeolocatedUser = !!position

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
