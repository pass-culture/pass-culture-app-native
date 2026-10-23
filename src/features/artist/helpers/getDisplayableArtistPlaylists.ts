import { SearchGroupNameEnumv2 } from 'api/gen'
import { ARTIST_CATEGORY_PLAYLISTS } from 'features/artist/constants'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { ArtistCategoryPlaylistId } from 'libs/analytics/helpers/logViewItem'

export type DisplayableArtistPlaylist = {
  entryId: ArtistCategoryPlaylistId
  items: AlgoliaOfferWithArtistAndEan[]
  playlistIndex: number
  searchGroupName: SearchGroupNameEnumv2
  title: string
}

export const getDisplayableArtistPlaylists = (
  items: AlgoliaOfferWithArtistAndEan[],
  baseIndex = 0
): DisplayableArtistPlaylist[] =>
  ARTIST_CATEGORY_PLAYLISTS.reduce<DisplayableArtistPlaylist[]>(
    (artistPlaylists, { includedSubcategoryIds, label, playlistId, searchGroupName }) => {
      const playlistItems = items.filter((item) =>
        includedSubcategoryIds.some((subcategoryId) => subcategoryId === item.offer.subcategoryId)
      )

      if (playlistItems.length === 0) return artistPlaylists

      return [
        ...artistPlaylists,
        {
          entryId: playlistId,
          items: playlistItems,
          playlistIndex: artistPlaylists.length + baseIndex,
          searchGroupName,
          title: label,
        },
      ]
    },
    []
  )
