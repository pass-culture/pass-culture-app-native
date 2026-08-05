import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FC, useCallback, useEffect, useRef } from 'react'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { syncSearchStateFromRouteParams } from 'features/search/helpers/syncSearchStateFromRouteParams'
import { SearchResults as SearchResultsV1 } from 'features/search/pages/SearchResults/v1/SearchResults'
import { SearchResults } from 'features/search/pages/SearchResults/v2/SearchResults'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const SearchResultsContainer: FC = () => {
  const { params } = useRoute<UseRouteType<'SearchResults'>>()
  const { dispatch } = useSearch()
  const paramsRef = useRef(params)

  useEffect(() => {
    paramsRef.current = params
  }, [params])

  const enableNewSearchResultsPage = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_NEW_SEARCH_RESULTS_PAGE
  )

  useFocusEffect(
    useCallback(() => {
      syncSearchStateFromRouteParams(paramsRef.current, dispatch)
    }, [dispatch])
  )

  return enableNewSearchResultsPage ? <SearchResults /> : <SearchResultsV1 />
}
