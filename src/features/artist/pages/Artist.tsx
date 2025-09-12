import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artist, isError, error, isLoading } = useArtistQuery(params.id)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (isLoading || !artist || !enableArtistPage) return null

  return (
    <ArtistBody artist={artist} artistPlaylist={artistPlaylist} artistTopOffers={artistTopOffers} />
  )
}
