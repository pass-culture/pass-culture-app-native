import { useNavigationState } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { Form } from 'ui/components/Form'
import { Page } from 'ui/pages/Page'
import { getSpacing } from 'ui/theme'
import { useSearch } from 'features/search/context/SearchWrapper'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const AISearch = () => {
  const { searchState } = useSearch()
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.[routes?.length - 1]?.name
  useSync(currentRoute === 'SearchLanding')

  const netInfo = useNetInfoContext()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />

          <Container>
            <SearchHeader
              searchInputID={searchInputID}
              shouldDisplaySubtitle
              addSearchHistory={addToHistory}
              searchInHistory={setQueryHistoryMemoized}
            />
          </Container>
          {searchState.query.length === 0 ? (
            <SearchSuggestions
              queryHistory={queryHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
              filteredHistory={filteredHistory}
              shouldNavigateToSearchResults
            />
          ) : undefined}
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}

const Container = styled.View({
  marginBottom: getSpacing(2),
})
