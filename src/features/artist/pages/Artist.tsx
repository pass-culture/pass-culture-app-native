import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)

  return enableArtistPage ? <ArtistBody /> : <PageNotFound />
}
