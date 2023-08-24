import { LocationType } from 'features/search/enums'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'

export function getCurrentVenuesIndex(locationType?: LocationType, userPosition?: Position) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if (!locationType || (locationType === LocationType.EVERYWHERE && !userPosition)) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
