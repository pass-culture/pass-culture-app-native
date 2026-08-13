import React, { FC, useEffect } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { useWindowDimensions } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'
import {
  setInitialRegion,
  setRegion,
  setVenues,
  useVenueMapStore,
} from 'features/venueMap/store/venueMapStore'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { env } from 'libs/environment/env'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { LocationMode } from 'libs/location/types'
import { locationSelectors, useLocationConfiguration } from 'libs/locationV2/location.store'
import { Page } from 'ui/pages/Page'

export const SearchMapContainer: FC = () => {
  const transformHits = useTransformOfferHits()

  const { isFocusOnSuggestions, searchState } = useSearch()
  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const {
    data: { aroundPrecision },
  } = useRemoteConfigQuery()

  const { geolocation: geolocPosition, radius: aroundMeRadius } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)

  const searchFilters = {
    parameters: { page: 0, ...searchState },
    buildLocationParameterParams: {
      userLocation: locationSelectors.selectUserLocation(),
      selectedLocationMode: locationSelectors.selectLocationMode(),
      aroundPlaceRadius,
      aroundMeRadius,
      geolocPosition,
    },
    aroundPrecision,
    disabilitiesProperties: disabilities,
    isUserUnderage,
  }

  const { data: offersResponse } = useSearchOffersQuery(searchFilters, {
    select: (offersResponse) => selectSearchOffers({ data: offersResponse, transformHits }),
  })

  const initialRegion = useVenueMapStore((state) => state.initialRegion)
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const userLocation = locationSelectors.selectUserLocation()
    if (!userLocation) {
      return
    }
    const region = getRegionFromPosition(userLocation, width / height)
    if (!initialRegion) {
      setInitialRegion(region)
    }
    setRegion(region)
  }, [width, height, initialRegion])

  useEffect(() => {
    const geolocatedVenues = offersResponse?.offerVenues?.filter(
      (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
    )

    if (geolocatedVenues?.length) {
      setVenues(geolocatedVenues)
    }
  }, [offersResponse?.offerVenues])

  const { addToHistory, setQueryHistory } = useSearchHistory()

  const setQueryHistoryMemoized = (query: string) => setQueryHistory(query)

  return (
    <Page>
      <InstantSearch
        searchClient={getSearchClient}
        indexName={env.ALGOLIA_SUGGESTIONS_INDEX_NAME}
        insights={{ insightsClient: AlgoliaSearchInsights }}>
        <Configure hitsPerPage={5} clickAnalytics analytics />

        <Container>
          <SearchHeaderContainer>
            <SearchHeader
              addSearchHistory={addToHistory}
              searchInHistory={setQueryHistoryMemoized}
              withFilterButton={!isFocusOnSuggestions}
              withArrow
              shouldDisplayHeader={!isFocusOnSuggestions}
            />
          </SearchHeaderContainer>
          <VenueMapViewContainer />
        </Container>
      </InstantSearch>
    </Page>
  )
}

const Container = styled.View({
  flex: 1,
})

const SearchHeaderContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
