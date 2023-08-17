import { LocationType } from 'features/search/enums'
import { env } from 'libs/environment'

export function getCurrentVenuesIndex(locationType?: LocationType) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  const currentVenuesIndex =
    locationType === LocationType.EVERYWHERE ? venuesIndexSearchNewest : venuesIndexSearch

  return currentVenuesIndex
}
