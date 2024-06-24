import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueListModule } from 'features/home/components/modules/VenueListModule.web'
import { AppV2VenuesModule as AppV2VenuesModuleType, ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type Props = {
  displayParameters: AppV2VenuesModuleType['displayParameters']
  moduleId: string
  index: number
  homeEntryId: string
  data?: ModuleData
}

const isWeb = Platform.OS === 'web'

export const AppV2VenuesModule = ({
  data,
  moduleId,
  index,
  displayParameters,
  homeEntryId,
}: Props) => {
  const { playlistItems = [] } = data ?? { playlistItems: [] }
  const { isDesktopViewport } = useTheme()
  const enableAppV2VenueList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST)

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

  const MAX_ITEMS = isWeb && isDesktopViewport ? 6 : 4
  const moduleName = displayParameters.title

  return (
    <VenueListModule
      venues={playlistItems.slice(0, MAX_ITEMS) as VenueHit[]}
      moduleId={moduleId}
      moduleName={moduleName}
      homeVenuesListEntryId={homeEntryId}
    />
  )
}
