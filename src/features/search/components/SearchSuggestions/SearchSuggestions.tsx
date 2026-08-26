import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Configure, Index } from 'react-instantsearch-core'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { AutocompleteArtist } from 'features/search/components/AutocompleteArtist/AutocompleteArtist'
import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, Highlighted, HistoryItem, SearchState } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import {
  useLocationConfiguration,
  useLocationMode,
  useUserLocation,
} from 'libs/locationV2/location.store'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'

type SearchSuggestionsParams = {
  queryHistory: string
  addToHistory: (item: CreateHistoryItem) => Promise<void>
  removeFromHistory: (item: HistoryItem) => Promise<void>
  filteredHistory: HistoryItem[]
  shouldNavigateToSearchResults?: boolean
  offerCategories?: SearchGroupNameEnumv2[]
  header?: React.ReactNode
}
export const SearchSuggestions = ({
  queryHistory,
  addToHistory,
  removeFromHistory,
  filteredHistory,
  shouldNavigateToSearchResults,
  offerCategories,
  header,
}: SearchSuggestionsParams) => {
  const { navigate, setOptions } = useNavigation<UseNavigationType>()
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const userLocation = useUserLocation()
  const selectedLocationMode = useLocationMode()
  const { radius: aroundMeRadius, geolocation: geolocPosition } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
  const { venue } = searchState
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const shouldDisplayArtistsSuggestions = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ARTISTS_SUGGESTIONS_IN_SEARCH
  )

  useEffect(() => {
    setOptions({
      gestureEnabled: false,
    })

    return () => {
      setOptions({
        gestureEnabled: true,
      })
    }
  }, [setOptions])

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

  const onVenuePress = async (venueId: number) => {
    hideSuggestions()
    await analytics.logConsultVenue({
      venueId: venueId.toString(),
      from: 'searchAutoComplete',
    })
    navigate('Venue', { id: venueId })
  }

  const onArtistPress = async (artistId: string, artistName: string) => {
    hideSuggestions()
    await analytics.logConsultArtist({ artistId, artistName, from: 'searchAutoComplete' })
    navigate('Artist', { id: artistId })
  }

  const isQuerying = queryHistory.trim().length > 0
  const hasHistory = filteredHistory.length > 0

  const getAccessibilityMessage = () => {
    if (isQuerying) {
      return `Suggestions pour ${queryHistory}`
    }
    if (hasHistory) {
      const count = filteredHistory.length
      return `Historique de recherche, ${count} élément${count > 1 ? 's' : ''}`
    }
    return 'Aucun résultat ou historique'
  }
  return (
    <StyledScrollView
      testID="autocompleteScrollView"
      keyboardShouldPersistTaps="handled"
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      {header}

      <HiddenAccessibleText
        accessibilityLiveRegion="polite"
        accessibilityRole={AccessibilityRole.ALERT}
        id="search-suggestions-accessibility-message">
        {getAccessibilityMessage()}
      </HiddenAccessibleText>

      <SearchHistory
        history={filteredHistory}
        queryHistory={queryHistory}
        removeItem={removeFromHistory}
        onPress={onPressHistoryItem}
      />
      <AutocompleteOffer addSearchHistory={addToHistory} offerCategories={offerCategories} />
      {shouldDisplayArtistsSuggestions ? (
        <Index indexName={env.ALGOLIA_ARTISTS_INDEX_NAME}>
          <Configure hitsPerPage={5} clickAnalytics analytics />
          <AutocompleteArtist onItemPress={onArtistPress} />
        </Index>
      ) : null}
      <Index indexName={currentVenuesIndex}>
        <Configure
          hitsPerPage={5}
          clickAnalytics
          analytics
          aroundRadius="all"
          aroundLatLng={searchVenuePosition.aroundLatLng}
        />
        <AutocompleteVenue onItemPress={onVenuePress} />
      </Index>
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingTop: theme.designSystem.size.spacing.l,
    paddingBottom: theme.isMobileViewport
      ? theme.tabBar.height + theme.designSystem.size.spacing.m
      : theme.designSystem.size.spacing.m,
    paddingLeft: theme.designSystem.size.spacing.xl,
    paddingRight: theme.designSystem.size.spacing.xl,
  },
}))({
  flex: 1,
})
