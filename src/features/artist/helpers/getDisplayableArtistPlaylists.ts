import { SearchGroupNameEnumv2 } from 'api/gen'
import { ARTIST_CATEGORY_PLAYLISTS } from 'features/artist/constants'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'

type DisplayableArtistPlaylist = {
  entryId: string
  items: AlgoliaOfferWithArtistAndEan[]
  playlistIndex: number
  searchGroupName: SearchGroupNameEnumv2
  title: string
}

export const getDisplayableArtistPlaylists = (
  items: AlgoliaOfferWithArtistAndEan[]
): DisplayableArtistPlaylist[] =>
  ARTIST_CATEGORY_PLAYLISTS.reduce<DisplayableArtistPlaylist[]>(
    (artistPlaylists, { includedSubcategoryIds, label, searchGroupName }) => {
      const playlistItems = items.filter((item) =>
        includedSubcategoryIds.some((subcategoryId) => subcategoryId === item.offer.subcategoryId)
      )

      if (playlistItems.length === 0) return artistPlaylists

      const playlistIndex = artistPlaylists.length

      return [
        ...artistPlaylists,
        {
          entryId: `artist_offers_${playlistIndex}_${searchGroupName.toLowerCase()}`,
          items: playlistItems,
          playlistIndex,
          searchGroupName,
          title: label,
        },
      ]
    },
    []
  )
