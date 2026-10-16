import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
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
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { LocationMode } from 'libs/location/types'
import {
  useLocationConfiguration,
  useLocationMode,
  useUserLocation,
} from 'libs/locationV2/location.store'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Page } from 'ui/pages/Page'

export const SearchMapContainer: FC = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const headerHeight = useGetHeaderHeight()

  const transformHits = useTransformOfferHits()

  const { searchState } = useSearch()
  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()
  const {
    data: { aroundPrecision },
  } = useRemoteConfigQuery()

  const { geolocation: geolocPosition, radius: aroundMeRadius } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)

  const userLocation = useUserLocation()
  const selectedLocationMode = useLocationMode()

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

  const { data: offersResponse } = useSearchOffersQuery(searchFilters, {
    select: (data) => selectSearchOffers({ data, transformHits }),
  })

  const initialRegion = useVenueMapStore((state) => state.initialRegion)
  const { width, height } = useWindowDimensions()

  const updateRegionFromLocation = () => {
    if (!userLocation) {
      return
    }
    const region = getRegionFromPosition(userLocation, width / height)
    if (!initialRegion) {
      setInitialRegion(region)
    }
    setRegion(region)
  }

  useEffect(updateRegionFromLocation, [width, height, initialRegion, userLocation])

  const updateVenuesFromOffers = () => {
    const geolocatedVenues = offersResponse?.offerVenues.filter(
      (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
    )

    if (geolocatedVenues?.length) {
      setVenues(geolocatedVenues)
    }
  }

  useEffect(updateVenuesFromOffers, [offersResponse?.offerVenues])

  return (
    <Page>
      <PageHeaderWithoutPlaceholder title="Carte" onGoBack={goBack} shouldDisplayBackButton />
      <Container headerHeight={headerHeight}>
        {' '}
        <VenueMapViewContainer />
      </Container>
    </Page>
  )
}

const Container = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  flex: 1,
  marginTop: headerHeight,
}))
