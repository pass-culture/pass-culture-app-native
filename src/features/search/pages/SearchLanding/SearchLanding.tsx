import { SearchClient } from 'algoliasearch'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { Form } from 'ui/components/Form'
import { Spacer } from 'ui/theme'

const searchInputID = uuidv4()
const searchClient: SearchClient = {
  ...client,
  search(requests) {
    if (requests.every(({ params }) => !params?.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 0,
          processingTimeMS: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }
    return client.search(requests)
  },
}
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchLanding = () => {
  useSync()
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
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          searchClient={searchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          <SearchHeader
            searchInputID={searchInputID}
            shouldDisplaySubtitle
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
