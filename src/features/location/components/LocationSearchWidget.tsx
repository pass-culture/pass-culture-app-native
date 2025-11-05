import React from 'react'
import styled from 'styled-components/native'

import { LOCATION_TITLE_MAX_WIDTH } from 'features/location/components/LocationWidget'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

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
    <Container highlighted={isWidgetHighlighted}>
      <LocationButton
        onPress={showLocationModal}
        testID="Ouvrir la modale de localisation depuis la recherche">
        {isWidgetHighlighted ? (
          <LocationPointerHighlighted testID="location pointer filled" />
        ) : (
          <LocationPointerDefault testID="location pointer not filled" />
        )}
        <LocationTitle>{locationTitle}</LocationTitle>
      </LocationButton>
      <SearchLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
    </Container>
  )
}
const Container = styled.View<{ highlighted: boolean }>(({ theme, highlighted }) => ({
  flexDirection: 'row',
  height: theme.designSystem.size.spacing.xxl,
  borderRadius: theme.designSystem.size.borderRadius.l,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  borderWidth: 1,
  backgroundColor: highlighted ? theme.designSystem.color.background.subtle : 'transparent',
  borderColor: highlighted
    ? theme.designSystem.color.border.focused
    : theme.designSystem.color.border.default,
}))

const LocationPointerHighlighted = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.extraSmall,
}))({})

const LocationPointerDefault = styled(LocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.locked,
}))``

const LocationTitle = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
}))

const LocationButton = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: theme.designSystem.size.spacing.xs,
}))
