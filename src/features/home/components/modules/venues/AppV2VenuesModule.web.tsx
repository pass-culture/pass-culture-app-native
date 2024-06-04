import React from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueListModule } from 'features/home/components/modules/VenueListModule.web'
import { AppV2VenuesModule as AppV2VenuesModuleType, ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'

type Props = {
  displayParameters: AppV2VenuesModuleType['displayParameters']
  moduleId: string
  data?: ModuleData
  homeVenuesListEntryId?: string
}

const isWeb = Platform.OS === 'web'

export const AppV2VenuesModule = ({
  data,
  moduleId,
  displayParameters,
  homeVenuesListEntryId,
}: Props) => {
  const { playlistItems = [] } = data ?? { playlistItems: [] }
  const { isDesktopViewport } = useTheme()

  if (playlistItems.length === 0) return null

  const MAX_ITEMS = isWeb && isDesktopViewport ? 6 : 4
  const moduleName = displayParameters.title

  return (
    <VenueListModule
      venues={playlistItems.slice(0, MAX_ITEMS) as VenueHit[]}
      moduleId={moduleId}
      moduleName={moduleName}
      homeVenuesListEntryId={homeVenuesListEntryId}
    />
  )
}
