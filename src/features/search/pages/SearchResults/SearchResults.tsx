import { useNavigationState, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { env } from 'libs/environment'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { UsePerformanceProfilerOptions } from 'shared/performance/types'
import { useFirebasePerformanceProfiler } from 'shared/performance/useFirebasePerformanceProfiler'
import { Form } from 'ui/components/Form'
import { Spacer } from 'ui/theme'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults = () => {
  const route = useRoute<UseRouteType<'SearchResults'>>()

  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  useSync(currentRoute === 'SearchResults')

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  useFirebasePerformanceProfiler('SearchResult', { route } as UsePerformanceProfilerOptions)

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          <SearchHeader
            searchInputID={searchInputID}
            addSearchHistory={addToHistory}
            searchInHistory={setQueryHistoryMemoized}
          />
          <Spacer.Column numberOfSpaces={2} />
          {isFocusOnSuggestions ? (
            <SearchSuggestions
              queryHistory={queryHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
              filteredHistory={filteredHistory}
            />
          ) : (
            <SearchResultsContent />
          )}
        </InstantSearch>
      </Form.Flex>
    </React.Fragment>
  )
}
