import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { useLocation } from 'libs/geolocation'

export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { userPosition: position } = useLocation()

  const isEverywhereSearch = searchState.locationFilter?.locationType === LocationType.EVERYWHERE
  const isGeolocatedUser = !!position

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
