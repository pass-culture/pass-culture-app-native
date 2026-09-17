import React, { FunctionComponent } from 'react'

import { ArtistResponse } from 'api/gen'
import { ArtistCategoryPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistCategoryPlaylist'
import { getDisplayableArtistPlaylists } from 'features/artist/helpers/getDisplayableArtistPlaylists'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'

type ArtistPlaylistProps = {
  artist: ArtistResponse
  items: AlgoliaOfferWithArtistAndEan[]
  enableProAdvicesTag?: boolean
}

export const ArtistPlaylist: FunctionComponent<ArtistPlaylistProps> = ({
  artist,
  items,
  enableProAdvicesTag,
}) => {
  const artistPlaylists = getDisplayableArtistPlaylists(items)

  if (artistPlaylists.length === 0) return null

  return (
    <React.Fragment>
      {artistPlaylists.map(({ entryId, items, playlistIndex, title }) => (
        <ArtistCategoryPlaylist
          key={entryId}
          artist={artist}
          entryId={entryId}
          items={items}
          playlistIndex={playlistIndex}
          title={title}
          enableProAdvicesTag={enableProAdvicesTag}
        />
      ))}
    </React.Fragment>
  )
}
