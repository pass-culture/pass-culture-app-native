import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useLocation } from 'libs/geolocation'
import { useModal } from 'ui/components/modals/useModal'
import { VerticalSeparator } from 'ui/components/Separator'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Spacer, Typo } from 'ui/theme'

export const LocationSearchWidget = () => {
  const { isGeolocated, isCustomPosition, userPosition, place } = useLocation()
  const getLocationTitle = useCallback(() => {
    if (place !== null) {
      return place.label
    }
    if (userPosition !== null) {
      return 'Ma position'
    }
    return 'Me localiser'
  }, [place, userPosition])

  const locationTitle = getLocationTitle()

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
      <VerticalSeparator />
      <Spacer.Row numberOfSpaces={2} />
      <LocationButton onPress={showLocationModal} testID="Ouvrir la modale de localisation">
        {isWidgetHighlighted ? <LocationPointerFilled /> : <LocationPointerNotFilled />}
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
      </LocationButton>
      <React.Fragment>
        <VenueModal visible={venueModalVisible} dismissModal={hideVenueModal} />
        <SearchLocationModal
          visible={locationModalVisible}
          dismissModal={hideLocationModal}
          showVenueModal={showVenueModal}
        />
      </React.Fragment>
    </Container>
  )
}
const Container = styled.View({
  flexDirection: 'row',
  height: 32,
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

const LocationTitle = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({
  maxWidth: 74, // max width corresponds to the size of "Ma position" state.
})

const LocationButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
})
