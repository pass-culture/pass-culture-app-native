import { SearchClient } from 'algoliasearch'
import React, { useCallback, useMemo } from 'react'
import { Configure, Index, InstantSearch } from 'react-instantsearch-core'
import { Keyboard, StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { BodySearch } from 'features/search/components/BodySearch/BodySearch'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSyncSearch } from 'features/search/helpers/useSyncSearch/useSyncSearch'
import { Highlighted, HistoryItem, SearchState, SearchView } from 'features/search/types'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { Form } from 'ui/components/Form'
import { getSpacing, Spacer } from 'ui/theme'

const searchInputID = uuidv4()
const searchClient: SearchClient = {
  ...client,
  search(requests) {
    if (requests.every(({ params }) => !params?.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 0,
          processingTimeMS: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }
    return client.search(requests)
  },
}
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export function Search() {
  useSyncSearch()
  const netInfo = useNetInfoContext()
  const { searchState, dispatch } = useSearch()
  const { geolocPosition } = useLocation()
  const { locationFilter, view, venue } = searchState
  const { queryHistory, setQueryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const searchVenuePosition = buildSearchVenuePosition(locationFilter, geolocPosition, venue)

  const currentVenuesIndex = useMemo(
    () =>
      getCurrentVenuesIndex({
        locationType: locationFilter?.locationType,
        venue,
      }),
    [locationFilter?.locationType, venue]
  )

  const onVenuePress = useCallback(async (venueId: number) => {
    await analytics.logConsultVenue({ venueId, from: 'searchAutoComplete' })
  }, [])

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
    },
    [dispatch, searchState]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          searchClient={searchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          <SearchHeader
            searchInputID={searchInputID}
            searchView={view}
            addSearchHistory={addToHistory}
            searchInHistory={setQueryHistoryMemoized}
          />
          <Spacer.Column numberOfSpaces={2} />
          {view === SearchView.Suggestions ? (
            <StyledScrollView
              testID="autocompleteScrollView"
              keyboardShouldPersistTaps="handled"
              onScroll={Keyboard.dismiss}
              scrollEventThrottle={16}>
              <Spacer.Column numberOfSpaces={2} />
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
          ) : (
            <BodySearch view={view} />
          )}
        </InstantSearch>
      </Form.Flex>
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  flex: 1,
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))
