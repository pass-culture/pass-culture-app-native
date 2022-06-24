import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { SearchLegacy } from 'features/search/pages/SearchLegacy'
import { SearchRework } from 'features/search/pages/SearchRework'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'

export function Search() {
  const netInfo = useNetInfo()
  const { data: appSettings } = useAppSettings()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }
  if (appEnableSearchHomepageRework) {
    return <SearchRework />
  }

  return <SearchLegacy />
}
