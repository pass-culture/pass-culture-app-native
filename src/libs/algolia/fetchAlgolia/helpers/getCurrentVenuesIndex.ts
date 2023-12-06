import { LocationType } from 'features/search/enums'
import { Venue } from 'features/venue/types'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'

export function getCurrentVenuesIndex({
  locationType,
  userPosition,
  venue,
}: {
  locationType?: LocationType
  userPosition?: Position
  venue?: Venue
}) {
  const venuesIndexSearch = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH
  const venuesIndexSearchNewest = env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST

  if ((!locationType && !venue) || (locationType === LocationType.EVERYWHERE && !userPosition)) {
    return venuesIndexSearchNewest
  }

  return venuesIndexSearch
}
