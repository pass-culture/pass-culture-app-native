import React, { useCallback, useMemo } from 'react'
import { Configure, Index } from 'react-instantsearch-core'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, Highlighted, HistoryItem, SearchState } from 'features/search/types'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'

type SearchSuggestionsParams = {
  queryHistory: string
  addToHistory: (item: CreateHistoryItem) => Promise<void>
  removeFromHistory: (item: HistoryItem) => Promise<void>
  filteredHistory: HistoryItem[]
  shouldNavigateToSearchResults?: boolean
  offerCategories?: SearchGroupNameEnumv2[]
}
export const SearchSuggestions = ({
  queryHistory,
  addToHistory,
  removeFromHistory,
  filteredHistory,
  shouldNavigateToSearchResults,
  offerCategories,
}: SearchSuggestionsParams) => {
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const { userLocation, selectedLocationMode, aroundMeRadius, aroundPlaceRadius, geolocPosition } =
    useLocation()
  const { venue } = searchState
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')

  const searchVenuePosition = buildSearchVenuePosition(
    { userLocation, selectedLocationMode, aroundMeRadius, aroundPlaceRadius },
    venue
  )

  const currentVenuesIndex = useMemo(
    () =>
      getCurrentVenuesIndex({
        selectedLocationMode,
        geolocPosition,
      }),
    [selectedLocationMode, geolocPosition]
  )

  const onPressHistoryItem = useCallback(
    (item: Highlighted<HistoryItem>) => {
      Keyboard.dismiss()

      const searchId = uuidv4()
      const newSearchState: SearchState = {
        ...searchState,
        query: item.query,
        searchId,
        isFromHistory: true,
        isAutocomplete: undefined,
        offerGenreTypes: undefined,
        offerNativeCategories: item.nativeCategory ? [item.nativeCategory] : undefined,
        offerCategories: offerCategories ?? (item.category ? [item.category] : []),
        gtls: [],
      }

      dispatch({
        type: 'SET_STATE',
        payload: newSearchState,
      })
      if (shouldNavigateToSearchResults) {
        navigateToSearchResults(newSearchState, defaultDisabilitiesProperties)
      }
      hideSuggestions()
    },
    [
      searchState,
      offerCategories,
      dispatch,
      shouldNavigateToSearchResults,
      hideSuggestions,
      navigateToSearchResults,
    ]
  )

  const onVenuePress = (venueId: number) => {
    hideSuggestions()
    analytics.logConsultVenue({ venueId, from: 'searchAutoComplete' })
  }

  return (
    <StyledScrollView
      testID="autocompleteScrollView"
      keyboardShouldPersistTaps="handled"
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      <SearchHistory
        history={filteredHistory}
        queryHistory={queryHistory}
        removeItem={removeFromHistory}
        onPress={onPressHistoryItem}
      />
      <AutocompleteOffer addSearchHistory={addToHistory} offerCategories={offerCategories} />
      <Index indexName={currentVenuesIndex}>
        <Configure
          hitsPerPage={5}
          clickAnalytics
          aroundRadius="all"
          aroundLatLng={searchVenuePosition.aroundLatLng}
        />
        <AutocompleteVenue onItemPress={onVenuePress} />
      </Index>
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
  paddingBottom: theme.designSystem.size.spacing.m,
  flex: 1,
  paddingLeft: theme.designSystem.size.spacing.xl,
  paddingRight: theme.designSystem.size.spacing.xl,
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))
