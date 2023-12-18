import React from 'react'
import styled from 'styled-components/native'

import { LOCATION_TITLE_MAX_WIDTH } from 'features/location/components/LocationWidget'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const LocationSearchWidget = () => {
  const { place, selectedLocationMode } = useLocation()

  const locationTitle = getLocationTitle(place, selectedLocationMode)

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE

  return (
    <Container>
      <Spacer.Row numberOfSpaces={1} />
      <Separator.Vertical />
      <Spacer.Row numberOfSpaces={1} />
      <LocationButton
        onPress={showLocationModal}
        testID="Ouvrir la modale de localisation depuis la recherche">
        {isWidgetHighlighted ? (
          <LocationPointerFilled testID="location pointer filled" />
        ) : (
          <SmallLocationPointerNotFilled testID="location pointer not filled" />
        )}
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
      </LocationButton>
      <SearchLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
    </Container>
  )
}
const Container = styled.View({
  flexDirection: 'row',
  height: getSpacing(8),
})

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))({})

const SmallLocationPointerNotFilled = styled(LocationPointerNotFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const LocationTitle = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
})

const LocationButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
})
