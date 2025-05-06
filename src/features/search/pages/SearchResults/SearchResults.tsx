import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import { v4 as uuidv4 } from 'uuid'

import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { Form } from 'ui/components/Form'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults = () => {
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  useSync(currentRoute === 'SearchResults')

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, searchState } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const { geolocPosition } = useLocation()
  const previousGeolocPosition = usePrevious(geolocPosition)

  const isArtistInSearchActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE_IN_SEARCH)

  const {
    hits,
    hasNextPage,
    fetchNextPage,
    data,
    refetch,
    nbHits,
    isLoading,
    isFetching,
    isFetchingNextPage,
    userData,
    venuesUserData,
    facets,
    offerVenues,
  } = useSearchResults()

  const shouldRefetchResults = Boolean(
    (geolocPosition && !previousGeolocPosition) || (!geolocPosition && previousGeolocPosition)
  )

  useEffect(() => {
    if (shouldRefetchResults) {
      refetch()
    }
  }, [refetch, shouldRefetchResults])

  const handleEndReached = useCallback(() => {
    if (data && hasNextPage) {
      const [lastPage] = data.pages.slice(-1)

      if (lastPage && lastPage.offers.page > 0) {
        analytics.logSearchScrollToPage(lastPage.offers.page, searchState.searchId)
      }
      fetchNextPage()
    }
  }, [hasNextPage, data, fetchNextPage, searchState.searchId])

  const searchResultHits = isArtistInSearchActive ? hits : { ...hits, artists: [] }

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
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
            <SearchResultsContent
              hits={searchResultHits}
              onEndReached={handleEndReached}
              onSearchResultsRefresh={refetch}
              nbHits={nbHits}
              isLoading={isLoading}
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
              userData={userData}
              venuesUserData={venuesUserData}
              facets={facets}
              offerVenues={offerVenues}
            />
          )}
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}
