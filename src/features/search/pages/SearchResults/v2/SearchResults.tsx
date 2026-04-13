import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { SearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTab'
import { SearchResultsContent } from 'features/search/pages/SearchResults/v2/SearchResultsContent'
import { getSearchListContent } from 'features/search/pages/SearchResults/v2/utils'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import {
  SearchFilter,
  SelectSearchOffersParams,
} from 'features/search/queries/useSearchOffersQuery/types'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { selectSearchVenues } from 'features/search/queries/useSearchVenuesQuery/selectors/selectSearchVenues'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { SearchOfferHits } from 'features/search/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { AIFakeDoorModal } from 'shared/AIFakeDoorModal/AIFakeDoorModal'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults = () => {
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  useSync(currentRoute === 'SearchResults')
  const [searchIdGenerated] = useState(uuidv4)
  const [selectedFilter, setSelectedFilter] =
    useState<SelectSearchOffersParams['selectedFilter']>(null)

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, searchState, dispatch } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const { user } = useAuthContext()
  const { visible, showModal, hideModal } = useModal(false)

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius, geolocPosition } =
    useLocation()

  const isArtistInSearchActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE_IN_SEARCH)
  const enableAIFakeDoor = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_AI_FAKE_DOOR)

  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const {
    data: { aroundPrecision },
  } = useRemoteConfigQuery()

  const queryParams = {
    parameters: { page: 0, ...searchState },
    buildLocationParameterParams: {
      userLocation,
      selectedLocationMode,
      aroundPlaceRadius,
      aroundMeRadius,
      geolocPosition,
    },
    aroundPrecision,
    disabilitiesProperties: disabilities,
    isUserUnderage,
  }

  const transformHits = useTransformOfferHits()

  const {
    data: artists,
    isLoading: isArtistsQueryLoading,
    isFetching: isArtistsQueryFetching,
    isSuccess: isArtistsQuerySuccess,
  } = useSearchArtistsQuery(queryParams, {
    select: (data) => selectSearchArtists(data, selectedFilter),
  })
  const {
    data: offers,
    hasNextPage,
    fetchNextPage,
    isFetching: isOffersQueryFetching,
    refetch,
    isRefetching: isOffersQueryRefetching,
    isLoading: isOffersQueryLoading,
    isSuccess: isOffersQuerySuccess,
  } = useSearchOffersQuery(queryParams, {
    select: (data) => selectSearchOffers({ data, transformHits, selectedFilter }),
  })
  const {
    data: venues,
    isLoading: isVenuesQueryLoading,
    isFetching: isVenuesQueryFetching,
    isSuccess: isVenuesQuerySuccess,
  } = useSearchVenuesQuery(queryParams, {
    select: (data) => selectSearchVenues(data, selectedFilter),
  })

  const hits: SearchOfferHits = {
    artists: artists ?? [],
    duplicatedOffers: offers?.duplicatedOffers ?? [],
    offers: offers?.offers ?? [],
    venues: venues?.algoliaVenues ?? [],
    venueNotOpenToPublic: venues?.venueNotOpenToPublic ?? [],
  }

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
  const handleViewableItemsChanged = (items, moduleId, itemType, playlistIndex) => {
    pageTracking.trackViewableItems({
      moduleId,
      itemType,
      viewableItems: items,
      searchId: searchState.searchId,
      playlistIndex,
    })
  }

  const handleEndReached = async () => {
    if (!(offers && hasNextPage)) {
      return
    }
    const page = offers.lastPage?.offersResponse.page ?? 0

    if (page > 0) {
      const currentSearchId = searchState.searchId ?? searchIdGenerated
      void analytics.logSearchScrollToPage(page, currentSearchId)
    }
    await fetchNextPage()
  }

  const handleAIFakeDoorPress = (from: 'search' | 'searchAutoComplete') => {
    void analytics.logHasClickedFakeDoorCTA({
      featureName: 'conversational_search_AI',
      from,
      searchId: searchState.searchId ?? searchIdGenerated,
    })
    showModal()
  }

  const handlePressFilter = (filter: SearchFilter) =>
    setSelectedFilter((prev) => {
      return prev === filter ? null : filter
    })

  const searchResultHits = isArtistInSearchActive ? hits : { ...hits, artists: [] }

  const searchListContent = getSearchListContent({
    disabilities,
    selectedFilter,
    selectedLocationMode,
    venuesPlaylistTitle: venues?.venuesUserData?.[0]?.venue_playlist_title,
    hits: searchResultHits,
    nbHits: offers?.nbHits ?? hits.offers.length,
  })

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
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
            shouldDisplayHeader={!isFocusOnSuggestions}>
            <SearchTab selectedFilter={selectedFilter} onFilterPress={handlePressFilter} />
          </SearchHeader>
        </Container>
        {isFocusOnSuggestions ? (
          <SearchSuggestions
            queryHistory={queryHistory}
            addToHistory={addToHistory}
            removeFromHistory={removeFromHistory}
            filteredHistory={filteredHistory}
            enableAIFakeDoor={enableAIFakeDoor}
            onPressAIButton={() => handleAIFakeDoorPress('searchAutoComplete')}
          />
        ) : (
          <SearchResultsContent
            onEndReached={handleEndReached}
            onSearchResultsRefresh={() => refetch()}
            nbHits={offers?.nbHits ?? hits.offers.length}
            searchListContent={searchListContent}
            isFetching={isArtistsQueryFetching && isOffersQueryFetching && isVenuesQueryFetching}
            isLoading={isArtistsQueryLoading && isOffersQueryLoading && isVenuesQueryLoading}
            isRefetching={isOffersQueryRefetching}
            isSuccess={isArtistsQuerySuccess && isOffersQuerySuccess && isVenuesQuerySuccess}
            userData={offers?.userData}
            venuesUserData={venues?.venuesUserData ?? undefined}
            onViewableItemsChanged={handleViewableItemsChanged}
            enableAIFakeDoor={enableAIFakeDoor}
            onPressAIFakeDoorBanner={() => handleAIFakeDoorPress('search')}
            disabilities={disabilities}
            selectedFilter={selectedFilter}
          />
        )}
      </InstantSearch>

      {enableAIFakeDoor ? (
        <AIFakeDoorModal
          close={hideModal}
          visible={visible}
          userLocation={userLocation}
          userCity={user?.city}
        />
      ) : null}
    </Page>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
