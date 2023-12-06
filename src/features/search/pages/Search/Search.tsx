import { useNavigation, useRoute } from '@react-navigation/native'
import { SearchClient } from 'algoliasearch'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Configure, Index, InstantSearch } from 'react-instantsearch-core'
import { Keyboard, StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { BodySearch } from 'features/search/components/BodySearch/BodySearch'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { Highlighted, HistoryItem, SearchState, SearchView } from 'features/search/types'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
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
  const netInfo = useNetInfoContext()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch, searchState } = useSearch()
  const { userPosition, setPlace } = useLocation()
  const { queryHistory, setQueryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    dispatch({
      type: 'SET_STATE',
      payload: params ?? { view: SearchView.Landing },
    })
  }, [dispatch, params])

  useEffect(() => {
    if (params?.locationFilter?.locationType === LocationType.PLACE) {
      setPlace(params.locationFilter.place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentFilters = params?.locationFilter

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const currentView = useMemo(() => {
    return params?.view
  }, [params?.view])

  const searchVenuePosition = buildSearchVenuePosition(currentFilters, userPosition, params?.venue)

  const currentVenuesIndex = useMemo(
    () =>
      getCurrentVenuesIndex({
        locationType: currentFilters?.locationType,
        venue: searchState?.venue,
      }),
    [currentFilters?.locationType, searchState?.venue]
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

      navigate(...getTabNavConfig('Search', newSearchState))
    },
    [navigate, searchState]
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
            searchView={currentView}
            addSearchHistory={addToHistory}
            searchInHistory={setQueryHistoryMemoized}
          />
          <Spacer.Column numberOfSpaces={2} />
          {currentView === SearchView.Suggestions ? (
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
              <FeatureFlag
                featureFlag={RemoteStoreFeatureFlags.WIP_ENABLE_VENUES_IN_SEARCH_RESULTS}>
                <Index indexName={currentVenuesIndex}>
                  <Configure
                    hitsPerPage={5}
                    clickAnalytics
                    aroundRadius={searchVenuePosition.aroundRadius}
                    aroundLatLng={searchVenuePosition.aroundLatLng}
                  />
                  <AutocompleteVenue onItemPress={onVenuePress} />
                </Index>
              </FeatureFlag>
              <Spacer.Column numberOfSpaces={3} />
            </StyledScrollView>
          ) : (
            <BodySearch view={currentView} />
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
