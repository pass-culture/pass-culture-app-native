import { SearchClient } from 'algoliasearch'
import React, { FC, PropsWithChildren, useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
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

type Props = {
  offerCategories: SearchGroupNameEnumv2[]
  title: string
  placeholder?: string
}
export const ThematicSearchBar: FC<PropsWithChildren<Props>> = ({
  children,
  offerCategories,
  title,
  placeholder = 'Rechercher',
}) => {
  const { isFocusOnSuggestions } = useSearch()

  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const facetFilters =
    offerCategories.length > 0
      ? [
          `${env.ALGOLIA_OFFERS_INDEX_NAME}.facets.analytics.offer.searchGroupNamev2.value:${String(offerCategories[0])}`,
        ]
      : []

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={suggestionsIndex}
      future={{ preserveSharedStateOnUnmount: true }}
      insights={{ insightsClient: AlgoliaSearchInsights }}>
      <Configure facetFilters={[facetFilters]} clickAnalytics hitsPerPage={5} />
      <SearchHeader
        title={title}
        searchInputID={searchInputID}
        addSearchHistory={addToHistory}
        searchInHistory={setQueryHistoryMemoized}
        offerCategories={offerCategories}
        placeholder={placeholder}
      />
      <Spacer.Column numberOfSpaces={2} />
      {isFocusOnSuggestions ? (
        <SearchSuggestions
          queryHistory={queryHistory}
          addToHistory={addToHistory}
          removeFromHistory={removeFromHistory}
          filteredHistory={filteredHistory}
          shouldNavigateToSearchResults
          offerCategories={offerCategories}
        />
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </InstantSearch>
  )
}
