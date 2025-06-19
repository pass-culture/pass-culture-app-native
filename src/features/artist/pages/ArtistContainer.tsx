import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const ArtistContainer: FunctionComponent<{ artistId: string }> = ({ artistId }) => {
  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId,
  })
  const { data: artist, isLoading } = useArtistQuery(artistId)

  if (isLoading) return <LoadingPage />

  if (!artist) return <PageNotFound />

  return (
    <ArtistBody artist={artist} artistPlaylist={artistPlaylist} artistTopOffers={artistTopOffers} />
  )
}
