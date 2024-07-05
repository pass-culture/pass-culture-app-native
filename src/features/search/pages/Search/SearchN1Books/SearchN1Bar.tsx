import { SearchClient } from 'algoliasearch'
import React, { FC, PropsWithChildren, useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import { v4 as uuidv4 } from 'uuid'

import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { Spacer } from 'ui/theme'

// Ajouter depuis la route
// changer la route en SearchN1
// Ajouter les paramètres de livre
// Envoyer le titre dynamiquement
// Paramètre de livre dynamiquement

// Feature flag = WIP_PAGE_SEARCH_N1

// go back non fonctionnel sur les sous-catégories
// go back non fonctionnel sur les sous recherches
// recherche => manque la catégorie livre sélectionnée

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

export const SearchN1Bar: FC<PropsWithChildren> = ({ children }) => {
  const { isFocusOnSuggestions } = useSearch()

  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={suggestionsIndex}
      future={{ preserveSharedStateOnUnmount: true }}
      insights={{ insightsClient: AlgoliaSearchInsights }}>
      <Configure
        facetFilters={[
          [
            `${env.ALGOLIA_OFFERS_INDEX_NAME}.facets.analytics.offer.searchGroupNamev2.value:LIVRES`,
          ],
        ]}
        clickAnalytics
        hitsPerPage={5}
      />
      <SearchHeader
        withArrow
        title="Livres"
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
        <React.Fragment>{children}</React.Fragment>
      )}
    </InstantSearch>
  )
}
