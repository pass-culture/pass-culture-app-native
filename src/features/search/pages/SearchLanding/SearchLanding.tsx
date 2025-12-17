import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesList } from 'features/search/components/CategoriesList/CategoriesList'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { Form } from 'ui/components/Form'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchLanding = () => {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.SEARCH)

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions } = useSearch()
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
      <Form.Flex>
        {/* @ts-expect-error - type incompatibility with React 19 */}
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
              <CategoriesList />
            </CategoriesButtonsContainer>
          )}
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}

const CategoriesButtonsContainer = styled.View(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))
