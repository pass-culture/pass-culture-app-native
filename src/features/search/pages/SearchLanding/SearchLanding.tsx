import { useNavigationState, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground, StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { env } from 'libs/environment'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { UsePerformanceProfilerOptions } from 'shared/performance/types'
import { useFirebasePerformanceProfiler } from 'shared/performance/useFirebasePerformanceProfiler'
import { Form } from 'ui/components/Form'
import { Spacer } from 'ui/theme'

import GradientHeader from '../../images/GradientHeader.png'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchLanding = () => {
  const route = useRoute<UseRouteType<'SearchLanding'>>()

  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.[routes?.length - 1]?.name
  useSync(currentRoute === 'SearchLanding')

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const enableSearchLandingHeader = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_SEARCH_LANDING_HEADER
  )

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const renderHeader = () => {
    return (
      <React.Fragment>
        <SearchHeader
          searchInputID={searchInputID}
          shouldDisplaySubtitle
          addSearchHistory={addToHistory}
          searchInHistory={setQueryHistoryMemoized}
        />
        <Spacer.Column numberOfSpaces={2} />
      </React.Fragment>
    )
  }

  useFirebasePerformanceProfiler('SearchLanding', { route } as UsePerformanceProfilerOptions)

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          {enableSearchLandingHeader ? (
            <ImageBackground
              source={GradientHeader}
              resizeMode="stretch"
              testID="searchLandingHeader">
              {renderHeader()}
            </ImageBackground>
          ) : (
            renderHeader()
          )}
          {isFocusOnSuggestions ? (
            <SearchSuggestions
              queryHistory={queryHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
              filteredHistory={filteredHistory}
              shouldNavigateToSearchResults
            />
          ) : (
            <CategoriesButtonsContainer>
              <CategoriesButtons />
              <Spacer.TabBar />
            </CategoriesButtonsContainer>
          )}
        </InstantSearch>
      </Form.Flex>
    </React.Fragment>
  )
}

const CategoriesButtonsContainer = styled.View({
  flex: 1,
  overflowY: 'auto',
})
