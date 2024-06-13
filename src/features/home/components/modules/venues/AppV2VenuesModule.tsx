import React from 'react'

import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type Props = {
  data?: ModuleData
  homeEntryId: string
}

export const AppV2VenuesModule = ({ data, homeEntryId }: Props) => {
  const enableAppV2VenueList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableAppV2VenueList,
    homeId: homeEntryId,
  })
  const { playlistItems = [] } = data ?? { playlistItems: [] }

  if (playlistItems.length === 0 || !hasGraphicRedesign) return null

  return <VenueListModule venues={playlistItems.slice(0, 4) as VenueHit[]} />
}
