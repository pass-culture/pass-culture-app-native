import { LocationType } from 'features/search/enums'
import { useSearch } from 'features/search/context/SearchWrapper/SearchWrapper'
import { useGeolocation } from 'libs/geolocation'

export const useHasPosition = () => {
  const { searchState } = useSearch()
  const { position } = useGeolocation()

  const isEverywhereSearch = searchState.locationFilter?.locationType === LocationType.EVERYWHERE
  const isGeolocatedUser = position !== null

  return !isEverywhereSearch || (isGeolocatedUser && isEverywhereSearch)
}
