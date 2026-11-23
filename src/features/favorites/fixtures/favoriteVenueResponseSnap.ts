import { FavoriteVenueDataResponse, FavoriteVenueResponse } from 'api/gen'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'

export const venueFavoriteResponseSnap: FavoriteVenueDataResponse = {
  id: venueDataTest.id,
  image: 'image1',
  name: venueDataTest.name,
}

export const favoriteVenueResponseSnap: FavoriteVenueResponse = {
  id: 480,
  venue: venueFavoriteResponseSnap,
}
