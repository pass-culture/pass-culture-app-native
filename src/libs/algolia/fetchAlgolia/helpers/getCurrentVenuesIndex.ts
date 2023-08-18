import { LocationType } from 'features/search/enums'
import { env } from 'libs/environment'

export function getCurrentVenuesIndex(locationType?: LocationType) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if (!locationType || locationType === LocationType.EVERYWHERE) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
