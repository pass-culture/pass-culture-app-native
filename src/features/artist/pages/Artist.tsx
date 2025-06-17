import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { ArtistContainer } from './ArtistContainer'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!enableArtistPage) return null

  return <ArtistContainer artistId={params.id} />
}
