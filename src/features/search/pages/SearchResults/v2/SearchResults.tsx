//

import { useNavigationState } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { ViewToken } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { selectSearchVenues } from 'features/search/queries/useSearchVenuesQuery/selectors/selectSearchVenues'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
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
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
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

  const { data: artists, isLoading: isArtistsQueryLoading } = useSearchArtistsQuery(queryParams, {
    select: selectSearchArtists,
  })
  const {
    data: offers,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isLoading: isOffersQueryLoading,
  } = useSearchOffersQuery(queryParams, {
    select: (data) => selectSearchOffers({ data, transformHits }),
  })
  const { data: venues, isLoading: isVenuesQueryLoading } = useSearchVenuesQuery(queryParams, {
    select: selectSearchVenues,
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
              enableAIFakeDoor={enableAIFakeDoor}
              onPressAIButton={showModal}
            />
          ) : (
            <SearchResultsContent
              hits={searchResultHits}
              onEndReached={handleEndReached}
              onSearchResultsRefresh={() => refetch()}
              nbHits={offers?.nbHits ?? 0}
              isLoading={isArtistsQueryLoading && isOffersQueryLoading && isVenuesQueryLoading}
              isRefetching={isRefetching}
              userData={offers?.userData}
              venuesUserData={venues?.venuesUserData ?? undefined}
              offerVenues={offers?.offerVenues ?? []}
              onViewableItemsChanged={handleViewableItemsChanged}
              enableAIFakeDoor={enableAIFakeDoor}
              onPressAIFakeDoorBanner={showModal}
            />
          )}
        </InstantSearch>
      </Form.Flex>
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
