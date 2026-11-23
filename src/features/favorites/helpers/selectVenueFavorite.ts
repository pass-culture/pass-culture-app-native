import { FavoriteVenueResponse, PaginatedResponseFavoriteVenueResponse } from 'api/gen'

export const selectVenueFavorite = (
  data?: PaginatedResponseFavoriteVenueResponse,
  venueId?: number
): FavoriteVenueResponse | undefined => {
  if (!data?.favorites || !venueId) return undefined
  return data.favorites.find((favorite) => favorite.venue.id === venueId)
}
