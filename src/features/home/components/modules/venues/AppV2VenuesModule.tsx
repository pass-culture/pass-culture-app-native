import React, { useEffect } from 'react'

import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type Props = {
  moduleId: string
  homeEntryId: string
  index: number
  data?: ModuleData
}

export const AppV2VenuesModule = ({ data, homeEntryId, moduleId, index }: Props) => {
  const enableAppV2VenueList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST)
  const { playlistItems = [] } = data ?? { playlistItems: [] }

  const shouldModuleBeDisplayed = playlistItems.length > 0 && enableAppV2VenueList

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.VENUES_PLAYLIST_APP_V2,
        index,
        homeEntryId,
        venues: (playlistItems.slice(0, 4) as VenueHit[]).map((item) => String(item.id)),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  return (
    <VenueListModule
      venues={playlistItems.slice(0, 4) as VenueHit[]}
      moduleId={moduleId}
      homeVenuesListEntryId={homeEntryId}
    />
  )
}
