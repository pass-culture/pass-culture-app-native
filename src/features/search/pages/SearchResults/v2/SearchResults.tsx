import React, { FC, useCallback, useEffect, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
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
import { env } from 'libs/environment/env'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { LocationMode } from 'libs/location/types'
import {
  useLocationConfiguration,
  useLocationMode,
  useUserLocation,
} from 'libs/locationV2/location.store'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const searchIdGenerated = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchResults: FC = () => {
  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, searchState, dispatch } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const isZoomedAt200 = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  const isLandscape = useIsLandscape()
  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const [selectedSearchTab, setSelectedSearchTab] =
    useState<SelectSearchOffersParams['selectedFilter']>(undefined)

  const handleTabPress = (tab: SearchFilter) =>
    setSelectedSearchTab(tab === selectedSearchTab ? undefined : tab)

  const userLocation = useUserLocation()
  const selectedLocationMode = useLocationMode()
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
  const { radius: aroundMeRadius, geolocation: geolocPosition } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )
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

  const [hasBeenClicked, setHasBeenClicked] = useState(false)

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
              header={isZoomedAt200 || isLandscape ? searchHeader : undefined}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isZoomedAt200 || isLandscape ? null : searchHeader}
            {(() => {
              switch (selectedSearchTab) {
                case 'Offres':
                  return (
                    <OffersList
                      searchFilters={searchFilters}
                      hasBeenClicked={hasBeenClicked}
                      setHasBeenClicked={setHasBeenClicked}
                    />
                  )
                case 'Lieux':
                  return <VenuesList searchFilters={searchFilters} />
                case 'Artistes':
                  return <ArtistsList searchFilters={searchFilters} />
                default:
                  return (
                    <AllSearchResultsList
                      header={isZoomedAt200 || isLandscape ? searchHeader : undefined}
                      searchFilters={searchFilters}
                      hasBeenClicked={hasBeenClicked}
                      setHasBeenClicked={setHasBeenClicked}
                    />
                  )
              }
            })()}
          </React.Fragment>
        )}
      </InstantSearch>
    </Page>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
