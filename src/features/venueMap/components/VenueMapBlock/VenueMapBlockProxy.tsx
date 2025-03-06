import React from 'react'

import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FeatureToggle } from 'shared/featureflag/FeatureToggle'

import type { VenueMapBlockProps } from './types'
import { VenueMapBlock } from './VenueMapBlock'
import { VenueMapBlockLegacy } from './VenueMapBlockLegacy'

export const VenueMapBlockProxy = (props: VenueMapBlockProps) => (
  <FeatureToggle featureFlag={RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK}>
    {(isActive) => {
      const Component = isActive ? VenueMapBlock : VenueMapBlockLegacy
      return <Component {...props} />
    }}
  </FeatureToggle>
)
