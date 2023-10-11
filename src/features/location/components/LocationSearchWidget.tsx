import React from 'react'
import styled from 'styled-components/native'

import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useLocation } from 'libs/geolocation'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const LocationSearchWidget = () => {
  const { isGeolocated, isCustomPosition, userPosition, place } = useLocation()

  const locationTitle = getLocationTitle(place, userPosition)

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const {
    visible: venueModalVisible,
    showModal: showVenueModal,
    hideModal: hideVenueModal,
  } = useModal()

  const isWidgetHighlighted = isGeolocated || !!isCustomPosition

  return (
    <Container>
      <Separator.Vertical />
      <Spacer.Row numberOfSpaces={2} />
      <LocationButton onPress={showLocationModal} testID="Ouvrir la modale de localisation">
        {isWidgetHighlighted ? <LocationPointerFilled /> : <LocationPointerNotFilled />}
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
      </LocationButton>
      <VenueModal visible={venueModalVisible} dismissModal={hideVenueModal} />
      <SearchLocationModal
        visible={locationModalVisible}
        dismissModal={hideLocationModal}
        showVenueModal={showVenueModal}
      />
    </Container>
  )
}
const Container = styled.View({
  flexDirection: 'row',
  height: getSpacing(8),
})

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))({})

const LocationPointerNotFilled = styled(BicolorLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  color2: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const MA_POSITION_WIDTH = 74

const LocationTitle = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({
  maxWidth: MA_POSITION_WIDTH,
})

const LocationButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
})
