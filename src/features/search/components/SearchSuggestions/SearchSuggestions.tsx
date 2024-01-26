import React, { useCallback, useMemo } from 'react'
import { Configure, Index } from 'react-instantsearch-core'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  CreateHistoryItem,
  Highlighted,
  HistoryItem,
  SearchState,
  SearchView,
} from 'features/search/types'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/location'
import { getSpacing, Spacer } from 'ui/theme'

const onVenuePress = async (venueId: number) => {
  await analytics.logConsultVenue({ venueId, from: 'searchAutoComplete' })
}

type SearchSuggestionsParams = {
  queryHistory: string
  addToHistory: (item: CreateHistoryItem) => Promise<void>
  removeFromHistory: (item: HistoryItem) => Promise<void>
  filteredHistory: HistoryItem[]
}
export const SearchSuggestions = ({
  queryHistory,
  addToHistory,
  removeFromHistory,
  filteredHistory,
}: SearchSuggestionsParams) => {
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const { geolocPosition } = useLocation()
  const { locationFilter, venue } = searchState

  const searchVenuePosition = buildSearchVenuePosition(locationFilter, geolocPosition, venue)

  const currentVenuesIndex = useMemo(
    () =>
      getCurrentVenuesIndex({
        locationType: locationFilter?.locationType,
        venue,
      }),
    [locationFilter?.locationType, venue]
  )

  const onPressHistoryItem = useCallback(
    (item: Highlighted<HistoryItem>) => {
      Keyboard.dismiss()

      const searchId = uuidv4()
      const newSearchState: SearchState = {
        ...searchState,
        query: item.query,
        view: SearchView.Results,
        searchId,
        isFromHistory: true,
        isAutocomplete: undefined,
        offerGenreTypes: undefined,
        offerNativeCategories: item.nativeCategory ? [item.nativeCategory] : undefined,
        offerCategories: item.category ? [item.category] : [],
      }

      dispatch({
        type: 'SET_STATE',
        payload: newSearchState,
      })
      hideSuggestions()
    },
    [dispatch, searchState, hideSuggestions]
  )

  return (
    <StyledScrollView
      testID="autocompleteScrollView"
      keyboardShouldPersistTaps="handled"
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      <Spacer.Column numberOfSpaces={4} />
      <SearchHistory
        history={filteredHistory}
        queryHistory={queryHistory}
        removeItem={removeFromHistory}
        onPress={onPressHistoryItem}
      />
      <AutocompleteOffer addSearchHistory={addToHistory} />
      <Index indexName={currentVenuesIndex}>
        <Configure
          hitsPerPage={5}
          clickAnalytics
          aroundRadius={searchVenuePosition.aroundRadius}
          aroundLatLng={searchVenuePosition.aroundLatLng}
        />
        <AutocompleteVenue onItemPress={onVenuePress} />
      </Index>
      <Spacer.Column numberOfSpaces={3} />
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  flex: 1,
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))
