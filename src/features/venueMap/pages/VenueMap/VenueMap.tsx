import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { FILTER_BANNER_HEIGHT } from 'features/venueMap/components/VenueMapView/constant'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useVenueMapStore } from 'features/venueMap/context/useVenueMapStore'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackSessionDuration'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ellipseString } from 'shared/string/ellipseString'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

const MAX_VENUE_CHARACTERS = 20

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const { venueTypeCode } = useVenueMapStore()
  const enableVenueMapTypeFilter = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER)

  const headerHeight = useGetHeaderHeight()
  const { height } = useWindowDimensions()

  const {
    visible: venueTypeModalVisible,
    showModal: showVenueTypeModal,
    hideModal: hideVenueTypeModal,
  } = useModal(false)

  const withFilterBanner = enableVenueMapTypeFilter ? FILTER_BANNER_HEIGHT : 0
  const venueMapHeight = height - (headerHeight + withFilterBanner)

  useTrackMapSessionDuration()
  useTrackMapSeenDuration()

  const venueTypeLabel = getVenueTypeLabel(venueTypeCode) ?? 'Tous les lieux'

  return (
    <React.Fragment>
      <Container>
        <StyledHeader title="Carte des lieux" onGoBack={goBack} />
        <PlaceHolder headerHeight={headerHeight + withFilterBanner} />
        {enableVenueMapTypeFilter ? (
          <FilterBannerContainer headerHeight={headerHeight}>
            <StyledUl>
              <StyledLi>
                <SingleFilterButton
                  label={ellipseString(venueTypeLabel, MAX_VENUE_CHARACTERS)}
                  isSelected={venueTypeCode !== null}
                  onPress={showVenueTypeModal}
                />
              </StyledLi>
            </StyledUl>
          </FilterBannerContainer>
        ) : null}
        <MapContainer>
          <VenueMapView height={venueMapHeight} />
        </MapContainer>
      </Container>
      <VenueTypeModal hideModal={hideVenueTypeModal} isVisible={venueTypeModalVisible} />
    </React.Fragment>
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
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(1),
}))

const MapContainer = styled.View({
  flex: 1,
})

const StyledUl = styled(Ul)({
  alignItems: 'center',
})

const StyledLi = styled(Li)({
  marginLeft: getSpacing(1),
  marginTop: getSpacing(1),
  marginBottom: getSpacing(1),
})
