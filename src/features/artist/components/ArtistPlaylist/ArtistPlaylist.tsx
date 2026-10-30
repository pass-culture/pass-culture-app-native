import React, { FunctionComponent } from 'react'

import { ArtistResponse } from 'api/gen'
import { ArtistCategoryPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistCategoryPlaylist'
import { DisplayableArtistPlaylist } from 'features/artist/helpers/getDisplayableArtistPlaylists'

type ArtistPlaylistsProps = {
  artist: ArtistResponse
  playlists: DisplayableArtistPlaylist[]
}

export const ArtistPlaylists: FunctionComponent<ArtistPlaylistsProps> = ({ artist, playlists }) => {
  if (playlists.length === 0) return null

  return (
    <React.Fragment>
      {playlists.map(({ entryId, items, playlistIndex, title }) => (
        <ArtistCategoryPlaylist
          key={entryId}
          artist={artist}
          entryId={entryId}
          items={items}
          playlistIndex={playlistIndex}
          title={title}
        />
      ))}
    </React.Fragment>
  )
}
