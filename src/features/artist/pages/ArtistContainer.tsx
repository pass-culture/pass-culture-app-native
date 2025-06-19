import React, { ComponentProps, FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { LoadingPage } from 'ui/pages/LoadingPage'

const toto = {
  loading: () => <LoadingPage />,
  idle: () => {
    throw new Error('Not implemented yet: "idle" ')
  },
  success: ({ artist, artistPlaylist, artistTopOffers }: ComponentProps<typeof ArtistBody>) => (
    <ArtistBody artist={artist} artistPlaylist={artistPlaylist} artistTopOffers={artistTopOffers} />
  ),
  error: () => <PageNotFound />,
}

export const ArtistContainer: FunctionComponent<{ artistId: string }> = ({ artistId }) => {
  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({ artistId })
  const { data: artist, status } = useArtistQuery(artistId)

  const Component = toto[status]
  return (
    <Component artist={artist} artistPlaylist={artistPlaylist} artistTopOffers={artistTopOffers} />
  )
}
