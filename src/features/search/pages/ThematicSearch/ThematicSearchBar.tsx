import React, { FC, PropsWithChildren, useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { env } from 'libs/environment/env'

const searchInputID = uuidv4()

const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

type Props = {
  offerCategories: SearchGroupNameEnumv2[]
  title: string
}
export const ThematicSearchBar: FC<PropsWithChildren<Props>> = ({
  children,
  offerCategories,
  title,
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
      searchClient={getSearchClient}
      indexName={suggestionsIndex}
      future={{ preserveSharedStateOnUnmount: true }}
      insights={{ insightsClient: AlgoliaSearchInsights }}>
      <Configure facetFilters={[facetFilters]} clickAnalytics hitsPerPage={5} />
      <SearchHeaderContainer>
        <SearchHeader
          title={title}
          withArrow
          shouldDisplayHeader={!isFocusOnSuggestions}
          searchInputID={searchInputID}
          addSearchHistory={addToHistory}
          searchInHistory={setQueryHistoryMemoized}
          offerCategories={offerCategories}
        />
      </SearchHeaderContainer>
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

const SearchHeaderContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))
