import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'

const ArtistContainer: FunctionComponent<{ artistId: string }> = ({ artistId }) => {
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

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!enableArtistPage) return null

  return <ArtistContainer artistId={params.id} />
}
