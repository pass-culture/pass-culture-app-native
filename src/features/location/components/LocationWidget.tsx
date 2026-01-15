import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { ScreenOrigin } from 'features/location/enums'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocationWidgetTooltip } from 'features/location/helpers/useLocationWidgetTooltip'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { LocationPointerAppV2 } from 'ui/svg/icons/LocationPointerAppV2'
import { getSpacing, Typo } from 'ui/theme'

export const LOCATION_TITLE_MAX_WIDTH = getSpacing(25)
const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(58)
const TOOLTIP_POINTER_DISTANCE_FROM_RIGHT = getSpacing(5)

type Props = {
  screenOrigin: ScreenOrigin
}

export const LocationWidget: FunctionComponent<Props> = ({ screenOrigin }) => {
  const shouldShowHomeLocationModal = screenOrigin === ScreenOrigin.HOME

  const { place, selectedLocationMode } = useLocation()
  const {
    isTooltipVisible,
    hideTooltip,
    widgetWidth,
    onWidgetLayout,
    touchableRef,
    enableTooltip,
  } = useLocationWidgetTooltip(screenOrigin)

  const locationTitle = getLocationTitle(place, selectedLocationMode)

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE

  const locationIcon = isWidgetHighlighted ? (
    <LocationPointerFilled />
  ) : (
    <LocationPointerNotFilled />
  )

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    locationTitle,
    'Ouvrir la modale de localisation'
  )

  return (
    <React.Fragment>
      <StyledTouchable
        testID={computedAccessibilityLabel}
        onPress={showLocationModal}
        accessibilityLabel={computedAccessibilityLabel}
        {...(Platform.OS === 'web' ? { ref: touchableRef } : { onLayout: onWidgetLayout })}>
        <IconContainer isActive={isWidgetHighlighted}>{locationIcon}</IconContainer>
        <StyledCaption numberOfLines={3}>{locationTitle}</StyledCaption>
      </StyledTouchable>
      {shouldShowHomeLocationModal ? (
        <HomeLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
      ) : (
        <SearchLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
      )}
      {enableTooltip ? (
        <StyledTooltip
          label="Configure ta position et découvre les offres dans la zone géographique de ton choix."
          isVisible={isTooltipVisible}
          onHide={hideTooltip}
          widgetWidth={widgetWidth}
        />
      ) : null}
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)<{ widgetWidth?: number }>(({ widgetWidth, theme }) => ({
  position: 'absolute',
  top: WIDGET_HEIGHT + theme.designSystem.size.spacing.s,
  right: (widgetWidth ?? LOCATION_TITLE_MAX_WIDTH) / 2 - TOOLTIP_POINTER_DISTANCE_FROM_RIGHT,
  width: TOOLTIP_WIDTH,
}))

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
  size: theme.icons.sizes.small,
}))({})

const LocationPointerNotFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.small,
}))({})
