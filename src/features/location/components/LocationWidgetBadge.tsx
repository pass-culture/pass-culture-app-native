import React from 'react'
import styled from 'styled-components/native'

import { LOCATION_TITLE_MAX_WIDTH } from 'features/location/components/LocationWidget'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

export const LocationWidgetBadge = () => {
  const numberOfLines = useFontScaleValue({ default: 1, at200PercentZoom: 3 })

  const { place, selectedLocationMode } = useLocation()

  const locationTitle = getLocationTitle(place, selectedLocationMode)

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    locationTitle,
    'Ouvrir la modale de localisation'
  )

  return (
    <Container highlighted={isWidgetHighlighted}>
      <LocationButton
        onPress={showLocationModal}
        accessibilityRole={AccessibilityRole.BUTTON}
        accessibilityLabel={computedAccessibilityLabel}>
        {isWidgetHighlighted ? (
          <LocationPointerHighlighted testID="location pointer highlighted" />
        ) : (
          <LocationPointerDefault testID="location pointer default" />
        )}
        <LocationTitle numberOfLines={numberOfLines}>{locationTitle}</LocationTitle>
      </LocationButton>
      <SearchLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
    </Container>
  )
}
const Container = styled.View<{ highlighted: boolean }>(({ theme, highlighted }) => ({
  flexDirection: 'row',
  minHeight: theme.designSystem.size.spacing.xxl,
  borderRadius: theme.designSystem.size.borderRadius.l,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  borderWidth: 1,
  backgroundColor: highlighted
    ? theme.designSystem.color.background.subtle
    : theme.designSystem.color.background.default,
  borderColor: highlighted
    ? theme.designSystem.color.border.selected
    : theme.designSystem.color.border.default,
}))

const LocationPointerHighlighted = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.extraSmall,
}))({})

const LocationPointerDefault = styled(LocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.default,
}))``

const LocationTitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
  color: theme.designSystem.color.text.default,
}))

const LocationButton = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: theme.designSystem.size.spacing.xs,
}))
