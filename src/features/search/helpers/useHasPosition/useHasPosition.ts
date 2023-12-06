import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { useLocation } from 'libs/location'

// TODO(refacto recherche): after removing location feature flag this can should be deleted
export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { geolocPosition } = useLocation()

  const isEverywhereSearch =
    searchState.locationFilter?.locationType === LocationType.EVERYWHERE && !searchState.venue
  const isGeolocatedUser = !!geolocPosition

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
