import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useLocation } from 'libs/geolocation'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const LocationTitleWidget = () => {
  const { icons } = useTheme()
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
    <React.Fragment>
      <LocationButton
        onPress={showLocationModal}
        testID="Ouvrir la modale de localisation depuis le titre"
        accessibilityLabel="Ouvrir la modale de localisation depuis le titre">
        <NotShrunk>
          {isWidgetHighlighted ? (
            <LocationPointerFilled size={icons.sizes.extraSmall} testID="location pointer filled" />
          ) : (
            <SmallLocationPointerNotFilled
              size={icons.sizes.extraSmall}
              testID="location pointer not filled"
            />
          )}
        </NotShrunk>
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
        <Spacer.Row numberOfSpaces={2} />
        <NotShrunk>
          <ArrowDown size={icons.sizes.extraSmall} />
        </NotShrunk>
      </LocationButton>
      <VenueModal visible={venueModalVisible} dismissModal={hideVenueModal} />
      <SearchLocationModal
        visible={locationModalVisible}
        dismissModal={hideLocationModal}
        showVenueModal={showVenueModal}
      />
    </React.Fragment>
  )
}

const LocationButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'lightblue',
  height: getSpacing(8),
  flexShrink: 1,
})

const NotShrunk = styled.View({
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))({})

const SmallLocationPointerNotFilled = styled(LocationPointerNotFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const LocationTitle = styled(Typo.ButtonText).attrs({
  numberOfLines: 1,
})({
  flexShrink: 1,
})
