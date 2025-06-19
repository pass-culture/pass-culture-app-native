import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { LoadingPage } from 'ui/pages/LoadingPage'

const defaultArtistResults = {
  artistPlaylist: [],
  artistTopOffers: [],
}

export const ArtistContainer: FunctionComponent<{ artistId: string }> = ({ artistId }) => {
  const { data: { artistPlaylist, artistTopOffers } = defaultArtistResults } =
    useArtistResultsQuery({ artistId })
  const { data: artist, status } = useArtistQuery(artistId)

  switch (status) {
    case 'loading':
      return <LoadingPage />

    case 'idle': {
      throw new Error('Not implemented yet: "idle" case')
    }

    case 'success':
      return (
        <ArtistBody
          artist={artist}
          artistPlaylist={artistPlaylist}
          artistTopOffers={artistTopOffers}
        />
      )

    case 'error':
      return <PageNotFound />
  }
}
