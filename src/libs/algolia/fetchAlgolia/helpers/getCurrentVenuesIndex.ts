import { LocationMode } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/location'

export function getCurrentVenuesIndex({
  selectedLocationMode,
  geolocPosition,
}: {
  selectedLocationMode: LocationMode
  geolocPosition: Position
}) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if (selectedLocationMode === LocationMode.EVERYWHERE && !geolocPosition) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
