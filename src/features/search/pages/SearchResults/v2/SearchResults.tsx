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
import { AllSearchResultsList } from 'features/search/pages/SearchResults/v2/components/SearchLists/AllSearchResultsList'
import { ArtistsList } from 'features/search/pages/SearchResults/v2/components/SearchLists/ArtistsList'
import { OffersList } from 'features/search/pages/SearchResults/v2/components/SearchLists/OffersList'
import { VenuesList } from 'features/search/pages/SearchResults/v2/components/SearchLists/VenuesList'
import { SearchTabs } from 'features/search/pages/SearchResults/v2/components/SearchTabs/SearchTabs'
import { hasActiveSearchFilters } from 'features/search/queries/helpers'
import {
  SearchFilter,
  SelectSearchOffersParams,
} from 'features/search/queries/useSearchOffersQuery/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { AIFakeDoorModal } from 'shared/AIFakeDoorModal/AIFakeDoorModal'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const searchIdGenerated = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults = () => {
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  useSync(currentRoute === 'SearchResults')

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, searchState, dispatch } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const { user } = useAuthContext()
  const { visible, showModal, hideModal } = useModal(false)
  const isZoomedAt200 = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  const isLandscape = useIsLandscape()
  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const enableAIFakeDoor = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_AI_FAKE_DOOR)

  const [selectedSearchTab, setSelectedSearchTab] =
    useState<SelectSearchOffersParams['selectedFilter']>(undefined)

  const handleTabPress = (tab: SearchFilter) =>
    setSelectedSearchTab(tab === selectedSearchTab ? undefined : tab)

  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius, geolocPosition } =
    useLocation()
  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const {
    data: { aroundPrecision },
  } = useRemoteConfigQuery()

  const searchFilters = {
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

  const hasSelectedSearchFilters = hasActiveSearchFilters(searchFilters)

  useEffect(() => {
    // searchId generation when search results is the app entry point (deeplinks generator)
    if (!searchState.searchId) {
      dispatch({ type: 'SET_SEARCH_ID', payload: searchIdGenerated })
    }
  }, [searchState.searchId, dispatch])

  const handleAIFakeDoorPress = (from: 'search' | 'searchAutoComplete') => {
    void analytics.logHasClickedFakeDoorCTA({
      featureName: 'conversational_search_AI',
      from,
      searchId: searchState.searchId ?? searchIdGenerated,
    })
    showModal()
  }

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  const searchHeader = (
    <Container>
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={addToHistory}
        searchInHistory={setQueryHistoryMemoized}
        withFilterButton={!isFocusOnSuggestions}
        withArrow
        shouldDisplayHeader={!isFocusOnSuggestions}>
        {isFocusOnSuggestions || hasSelectedSearchFilters ? null : (
          <SearchTabs
            searchFilters={searchFilters}
            onTabPress={handleTabPress}
            selectedSearchTab={selectedSearchTab}
          />
        )}
      </SearchHeader>
    </Container>
  )

  return (
    <Page>
      <InstantSearch
        searchClient={getSearchClient}
        indexName={suggestionsIndex}
        insights={{ insightsClient: AlgoliaSearchInsights }}>
        <Configure hitsPerPage={5} clickAnalytics analytics />
        {isFocusOnSuggestions ? (
          <React.Fragment>
            {isZoomedAt200 || isLandscape ? null : searchHeader}
            <SearchSuggestions
              queryHistory={queryHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
              filteredHistory={filteredHistory}
              enableAIFakeDoor={enableAIFakeDoor}
              onPressAIButton={() => handleAIFakeDoorPress('searchAutoComplete')}
              header={isZoomedAt200 || isLandscape ? searchHeader : undefined}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isZoomedAt200 || isLandscape ? null : searchHeader}
            {(() => {
              switch (selectedSearchTab) {
                case 'Offres':
                  return <OffersList searchFilters={searchFilters} />
                case 'Lieux':
                  return <VenuesList searchFilters={searchFilters} />
                case 'Artistes':
                  return <ArtistsList searchFilters={searchFilters} />
                default:
                  return (
                    <AllSearchResultsList
                      enableAIFakeDoor={enableAIFakeDoor}
                      onPressAIFakeDoorBanner={() => handleAIFakeDoorPress('search')}
                      header={isZoomedAt200 || isLandscape ? searchHeader : undefined}
                      searchFilters={searchFilters}
                    />
                  )
              }
            })()}
          </React.Fragment>
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
