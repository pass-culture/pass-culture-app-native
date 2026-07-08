import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ScreenOrigin } from 'features/location/enums'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { useLocationLabel, useLocationV2 } from 'libs/locationV2/location.store'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { LocationPointerAppV2 } from 'ui/svg/icons/LocationPointerAppV2'
import { getSpacing, Typo } from 'ui/theme'

export const LOCATION_TITLE_MAX_WIDTH = getSpacing(25)

type Props = {
  screenOrigin: ScreenOrigin
}

export const LocationWidget: FunctionComponent<Props> = ({ screenOrigin }) => {
  const shouldShowHomeLocationModal = screenOrigin === ScreenOrigin.HOME
  const { navigate } = useNavigation<UseNavigationType>()

  const { selectedLocationMode } = useLocation()

  const locationTitle = useLocationLabel()

  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE

  const state = useLocationV2()

  const { hasGeolocPosition } = useLocation()
  const isLocated =
    selectedLocationMode === LocationMode.AROUND_PLACE ||
    (selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition)

  console.log({ isLocated, hasGeolocPosition, state })

  const locationIcon = isWidgetHighlighted ? (
    <LocationPointerFilled />
  ) : (
    <LocationPointerNotFilled />
  )

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    locationTitle,
    'Ouvrir la modale de localisation'
  )

  const numberOfLines = useMobileFontScaleToDisplay({ default: 3, at200PercentZoom: 5 })

  const onPress = () => {
    navigate(shouldShowHomeLocationModal ? 'HomeLocationModal' : 'SearchLocationModal')
  }

  return (
    <WidgetContainer>
      <StyledTouchable
        testID={computedAccessibilityLabel}
        onPress={onPress}
        accessibilityLabel={computedAccessibilityLabel}>
        <IconContainer isActive={isWidgetHighlighted}>{locationIcon}</IconContainer>
        <StyledCaption numberOfLines={numberOfLines}>{locationTitle}</StyledCaption>
      </StyledTouchable>
    </WidgetContainer>
  )
}

const WidgetContainer = styled.View({
  position: 'relative',
  alignSelf: 'center',
})

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  alignItems: 'center',
  marginLeft: theme.designSystem.size.spacing.s,
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xs,
  textAlign: 'center',
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
}))

const IconContainer = styled.View<{ isActive: boolean }>(({ theme, isActive }) => ({
  width: theme.buttons.roundedButton.size,
  height: theme.buttons.roundedButton.size,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  border: isActive ? 2 : 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: isActive
    ? theme.designSystem.color.border.default
    : theme.designSystem.color.border.subtle,
  backgroundColor: theme.designSystem.color.background.default,
}))

const LocationPointerFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.designSystem.size.icon.m,
}))({})

const LocationPointerNotFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.designSystem.size.icon.m,
}))({})
