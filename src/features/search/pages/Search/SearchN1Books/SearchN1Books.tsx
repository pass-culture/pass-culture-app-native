import { SearchClient } from 'algoliasearch'
import React, { useCallback, useMemo } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CATEGORY_CRITERIA, Gradient } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { NativeCategoryEnum } from 'features/search/types'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'
import { Spacer } from 'ui/theme'

// rediriger vers les recherches
// changer le placeholder

// pas de focus, la liste est affichée en dessous
// focus, tout devient blanc
// si on clique on est redirigé
// si on tape entrée on arrive vers une nouvelle page

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

export const SearchN1Books = () => {
  const bookNativeCategories = useNativeCategories(SearchGroupNameEnumv2.LIVRES)
  const bookColorsGradients: Gradient = CATEGORY_CRITERIA[SearchGroupNameEnumv2.LIVRES]?.gradients

  const { isFocusOnSuggestions } = useSearch()

  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const bookSubcategoriesContent = useMemo(
    () =>
      bookNativeCategories.map((bookNativeCategory) => ({
        label: bookNativeCategory[1].label,
        colors: bookColorsGradients,
        nativeCategory: bookNativeCategory[0] as NativeCategoryEnum,
      })),
    [bookColorsGradients, bookNativeCategories]
  )

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={suggestionsIndex}
      future={{ preserveSharedStateOnUnmount: true }}
      insights={{ insightsClient: AlgoliaSearchInsights }}>
      <Configure
        facetFilters={[['PRODUCTION.facets.analytics.offer.searchGroupNamev2.value:LIVRES']]}
        clickAnalytics
        hitsPerPage={5}
      />
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
        <React.Fragment>
          <SearchResultsContent />
          <SubcategoryButtonList subcategoryButtonContent={bookSubcategoriesContent} />
        </React.Fragment>
      )}
    </InstantSearch>
  )
}
