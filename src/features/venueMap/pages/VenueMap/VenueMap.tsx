import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FILTER_BANNER_HEIGHT } from 'features/venueMap/components/VenueMapView/constant'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackSessionDuration'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(
    ...getTabNavConfig('SearchStackNavigator', { screen: 'Search', params: undefined })
  )
  const enableVenueMapTypeFilter = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER)

  const headerHeight = useGetHeaderHeight()
  const { height } = useWindowDimensions()

  const withFilterBanner = enableVenueMapTypeFilter ? FILTER_BANNER_HEIGHT : 0
  const venueMapHeight = height - (headerHeight + withFilterBanner)

  useTrackMapSessionDuration()
  useTrackMapSeenDuration()

  return (
    <Container>
      <StyledHeader title="Carte des lieux" onGoBack={goBack} />
      <PlaceHolder headerHeight={headerHeight + withFilterBanner} />
      {enableVenueMapTypeFilter ? (
        <FilterBannerContainer headerHeight={headerHeight}></FilterBannerContainer>
      ) : null}
      <MapContainer>
        <VenueMapView height={venueMapHeight} />
      </MapContainer>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const PlaceHolder = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: headerHeight,
}))

const FilterBannerContainer = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: FILTER_BANNER_HEIGHT,
  position: 'absolute',
  zIndex: 1,
  top: headerHeight,
  left: 0,
  right: 0,
}))

const MapContainer = styled.View({
  flex: 1,
})
