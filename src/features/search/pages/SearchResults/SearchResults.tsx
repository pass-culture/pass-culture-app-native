import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { ViewToken } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
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
import { useLocation } from 'libs/location/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { Form } from 'ui/components/Form'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults = () => {
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  useSync(currentRoute === 'SearchResults')
  const [searchIdGenerated] = useState(uuidv4)

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, searchState, dispatch } = useSearch()
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
    offerVenues,
  } = useSearchResults()

  const pageTracking = usePageTracking({
    pageName: 'SearchResults',
    pageLocation: 'searchresults',
  })

  useEffect(() => {
    // searchId generation when search results is the app entry point (deeplinks generator)
    if (!searchState.searchId) {
      dispatch({ type: 'SET_SEARCH_ID', payload: searchIdGenerated })
    }
  }, [searchState.searchId, searchIdGenerated, dispatch])

  // Handler for modules with the new system
  const handleViewableItemsChanged = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        searchId: searchState.searchId,
        playlistIndex,
      })
    },
    [pageTracking, searchState.searchId]
  )

  const shouldRefetchResults = Boolean(
    (geolocPosition && !previousGeolocPosition) || (!geolocPosition && previousGeolocPosition)
  )

  useEffect(() => {
    if (shouldRefetchResults) {
      void refetch()
    }
  }, [refetch, shouldRefetchResults])

  const handleEndReached = useCallback(() => {
    if (data && hasNextPage) {
      const [lastPage] = data.pages.slice(-1)
      const page = lastPage?.offers.page ?? 0

      if (page > 0) {
        const currentSearchId = searchState.searchId ?? searchIdGenerated
        void analytics.logSearchScrollToPage(page, currentSearchId)
      }
      void fetchNextPage()
    }
  }, [data, hasNextPage, fetchNextPage, searchState.searchId, searchIdGenerated])

  const searchResultHits = isArtistInSearchActive ? hits : { ...hits, artists: [] }

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
      <Form.Flex>
        <InstantSearch
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          <Container>
            <SearchHeader
              searchInputID={searchInputID}
              addSearchHistory={addToHistory}
              searchInHistory={setQueryHistoryMemoized}
              withFilterButton={!isFocusOnSuggestions}
              withArrow
              shouldDisplayHeader={!isFocusOnSuggestions}
            />
          </Container>
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
              offerVenues={offerVenues}
              onViewableItemsChanged={handleViewableItemsChanged}
            />
          )}
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
