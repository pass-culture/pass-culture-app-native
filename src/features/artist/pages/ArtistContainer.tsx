import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'

export const ArtistContainer: FunctionComponent<{ artistId: string }> = ({ artistId }) => {
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId,
  })
  const { data: artist } = useArtistQuery(params.id)

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!artist) return null

  return (
    <ArtistBody artist={artist} artistPlaylist={artistPlaylist} artistTopOffers={artistTopOffers} />
  )
}
