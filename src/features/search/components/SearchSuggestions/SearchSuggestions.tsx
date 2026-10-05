import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Configure, Index, useInstantSearch } from 'react-instantsearch-core'
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
import { getSearchSuggestionsStatus } from 'features/search/helpers/getSearchSuggestionsStatus'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useSearchSuggestionsAccessibility } from 'features/search/helpers/useSearchSuggestionsAccessibility'
import { SuggestionsSnapshot } from 'features/search/store/searchSuggestionsAccessibility.store'
import { CreateHistoryItem, Highlighted, HistoryItem, SearchState } from 'features/search/types'
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

type SearchSuggestionsParams = {
  suggestionsDescriptionId?: string
  queryHistory: string
  addToHistory: (item: CreateHistoryItem) => Promise<void>
  removeFromHistory: (item: HistoryItem) => Promise<void>
  filteredHistory: HistoryItem[]
  shouldNavigateToSearchResults?: boolean
  offerCategories?: SearchGroupNameEnumv2[]
  header?: React.ReactNode
  embedded?: boolean
}
export const SearchSuggestions = ({
  suggestionsDescriptionId,
  queryHistory,
  addToHistory,
  removeFromHistory,
  filteredHistory,
  shouldNavigateToSearchResults,
  offerCategories,
  header,
  embedded = false,
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
  const { status: searchStatus } = useInstantSearch()
  const accessibility = useSearchSuggestionsAccessibility(suggestionsDescriptionId)
  const publish = accessibility.publish
  const [suggestions, setSuggestions] = useState<{
    offers?: SuggestionsSnapshot
    artists?: SuggestionsSnapshot
    venues?: SuggestionsSnapshot
  }>({})

  const handleOffersChange = useCallback((snapshot: SuggestionsSnapshot) => {
    setSuggestions((previous) => ({ ...previous, offers: snapshot }))
  }, [])
  const handleArtistsChange = useCallback((snapshot: SuggestionsSnapshot) => {
    setSuggestions((previous) => ({ ...previous, artists: snapshot }))
  }, [])
  const handleVenuesChange = useCallback((snapshot: SuggestionsSnapshot) => {
    setSuggestions((previous) => ({ ...previous, venues: snapshot }))
  }, [])

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

  const { key, message, ready } = getSearchSuggestionsStatus({
    queryHistory,
    suggestions,
    filteredHistory,
    searchStatus,
    shouldDisplayArtistsSuggestions,
  })

  useEffect(() => {
    publish({ query: queryHistory, key, message, ready })
  }, [publish, queryHistory, key, message, ready])

  useEffect(() => () => publish(null), [publish])

  const content = (
    <SuggestionsContent>
      {header}

      <SearchHistory
        history={filteredHistory}
        queryHistory={queryHistory}
        removeItem={removeFromHistory}
        onPress={onPressHistoryItem}
      />
      <AutocompleteOffer
        addSearchHistory={addToHistory}
        offerCategories={offerCategories}
        onSuggestionsChange={handleOffersChange}
      />
      {shouldDisplayArtistsSuggestions ? (
        <Index indexName={env.ALGOLIA_ARTISTS_INDEX_NAME}>
          <Configure hitsPerPage={5} clickAnalytics analytics />
          <AutocompleteArtist
            onItemPress={onArtistPress}
            onSuggestionsChange={handleArtistsChange}
          />
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
        <AutocompleteVenue onItemPress={onVenuePress} onSuggestionsChange={handleVenuesChange} />
      </Index>
    </SuggestionsContent>
  )

  return embedded ? (
    content
  ) : (
    <StyledScrollView
      testID="autocompleteScrollView"
      keyboardShouldPersistTaps="handled"
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      {content}
    </StyledScrollView>
  )
}

const SuggestionsContent = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
  paddingBottom: theme.isMobileViewport
    ? theme.tabBar.height + theme.designSystem.size.spacing.m
    : theme.designSystem.size.spacing.m,
  paddingLeft: theme.designSystem.size.spacing.xl,
  paddingRight: theme.designSystem.size.spacing.xl,
}))

const StyledScrollView = styled.ScrollView({ flex: 1 })
