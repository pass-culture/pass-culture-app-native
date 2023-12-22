import { Venue } from 'features/venue/types'
import { LocationMode } from 'libs/algolia'
import { env } from 'libs/environment'
import { Position } from 'libs/location'

export function getCurrentVenuesIndex({
  locationType,
  userLocation,
  venue,
}: {
  locationType?: LocationMode
  userLocation?: Position
  venue?: Venue
}) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if ((!locationType && !venue) || (locationType === LocationMode.EVERYWHERE && !userLocation)) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
