import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { ArtistContainer } from './ArtistContainer'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  if (!enableArtistPage) return <PageNotFound />

  return <ArtistContainer artistId={params.id} />
}
