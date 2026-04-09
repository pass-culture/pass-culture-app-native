import React, { FC } from 'react'

import { SearchResults as SearchResultsV1 } from 'features/search/pages/SearchResults/v1/SearchResults'
import { SearchResults } from 'features/search/pages/SearchResults/v2/SearchResults'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const SearchResultsContainer: FC = () => {
  const enableNewSearchResultsPage = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_NEW_SEARCH_RESULTS_PAGE
  )

  return enableNewSearchResultsPage ? <SearchResults /> : <SearchResultsV1 />
}
