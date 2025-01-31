import { LocationMode } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location'

export function getCurrentVenuesIndex({
  selectedLocationMode,
  userLocation,
}: {
  selectedLocationMode: LocationMode
  userLocation: Position
}) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if (selectedLocationMode === LocationMode.EVERYWHERE && !userLocation) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
