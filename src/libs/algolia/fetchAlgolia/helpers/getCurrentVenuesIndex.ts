import { env } from 'libs/environment'

export function getCurrentVenuesIndex({
  isEverywhereWithNoGeolocPosition,
}: {
  isEverywhereWithNoGeolocPosition: boolean
}) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if (isEverywhereWithNoGeolocPosition) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
