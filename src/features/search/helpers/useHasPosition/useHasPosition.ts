import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { useGeolocation } from 'libs/geolocation'

export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { position } = useGeolocation()

  const isEverywhereSearch = searchState.locationFilter?.locationType === LocationType.EVERYWHERE
  const isGeolocatedUser = !!position

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
