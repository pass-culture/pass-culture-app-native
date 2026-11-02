import { FavoriteArtistResponse } from 'api/gen'
import { useArtistFavoritesQuery } from 'features/favorites/queries'

export const useArtistFavorite = ({
  artistId,
}: {
  artistId?: string
}): FavoriteArtistResponse | undefined | null => {
  const { data, isLoading } = useArtistFavoritesQuery()
  if (isLoading) return undefined
  const favorites = data?.favorites ?? []
  return favorites.find((favorite) => favorite.artist.id === artistId) ?? null
}
