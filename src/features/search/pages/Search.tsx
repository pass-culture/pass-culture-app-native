import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { SearchLegacy } from 'features/search/pages/SearchLegacy'
import { SearchRework } from 'features/search/pages/SearchRework'

export function Search() {
  const { data: appSettings } = useAppSettings()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false

  if (appEnableSearchHomepageRework) {
    return <SearchRework />
  }

  return <SearchLegacy />
}
