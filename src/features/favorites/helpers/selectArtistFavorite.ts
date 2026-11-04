import { FavoriteArtistResponse, PaginatedResponseFavoriteArtistResponse } from 'api/gen'

export const selectArtistFavorite = (
  data?: PaginatedResponseFavoriteArtistResponse,
  artistId?: string
): FavoriteArtistResponse | undefined => {
  if (!data?.favorites || !artistId) return undefined
  return data.favorites.find((favorite) => favorite.artist.id === artistId)
}
