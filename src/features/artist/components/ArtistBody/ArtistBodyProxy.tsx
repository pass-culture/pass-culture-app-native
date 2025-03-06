import React from 'react'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FeatureToggle } from 'shared/featureflag/FeatureToggle'

import { ArtistBody, ArtistBodyProps } from './ArtistBody'

export const ArtistBodyProxy = (props: ArtistBodyProps) => (
  <FeatureToggle featureFlag={RemoteStoreFeatureFlags.WIP_ARTIST_PAGE}>
    {(isActive) => (isActive ? <ArtistBody {...props} /> : <PageNotFound />)}
  </FeatureToggle>
)
