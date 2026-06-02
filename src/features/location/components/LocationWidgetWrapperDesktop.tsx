import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useLocationForLocationWidgetDesktop } from 'features/location/components/useLocationForLocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { useLocationWidgetTooltip } from 'features/location/helpers/useLocationWidgetTooltip'
import { locationModalActions } from 'libs/locationV2/locationModal.store'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointerAppV2 } from 'ui/svg/icons/LocationPointerAppV2'
import { getSpacing, Typo } from 'ui/theme'

const TOOLTIP_WIDTH = getSpacing(58)
const WIDGET_HEIGHT = getSpacing(5 + 1) // textSize + padding

type LocationWidgetWrapperDesktopProps = {
  screenOrigin: ScreenOrigin
  children: React.ReactNode
}

/**
 * The UI is the same so we just need a children as function
 * that will use modal props defined in
 * -> so children has to be a modal
 */
export const LocationWidgetWrapperDesktop: React.FC<
  PropsWithChildren<LocationWidgetWrapperDesktopProps>
> = ({ screenOrigin, children }) => {
  const { designSystem } = useTheme()
  const {
    title: locationTitle,
    isWidgetHighlighted,
    testId,
  } = useLocationForLocationWidgetDesktop()

  const {
    isTooltipVisible,
    widgetWidth,
    hideTooltip,
    onWidgetLayout,
    touchableRef,
    enableTooltip,
  } = useLocationWidgetTooltip(screenOrigin)

  const onPressLocationButton = () => {
    hideTooltip()
    locationModalActions.show()
  }

  const locationIcon = isWidgetHighlighted ? (
    <LocationPointerFilled testID="location pointer filled" />
  ) : (
    <LocationPointerNotFilled testID="location pointer not filled" />
  )

  return (
    <React.Fragment>
      {enableTooltip ? (
        <StyledTooltip
          label="Configure ta position et découvre les offres dans la zone géographique de ton choix."
          isVisible={isTooltipVisible}
          onHide={hideTooltip}
          widgetWidth={widgetWidth}
        />
      ) : null}
      <LocationButton
        {...(Platform.OS === 'web' ? { ref: touchableRef } : { onLayout: onWidgetLayout })}
        onPress={onPressLocationButton}
        testID={testId}
        accessibilityLabel={testId}>
        <NotShrunk>{locationIcon}</NotShrunk>
        <LocationTitle>{locationTitle}</LocationTitle>
        <NotShrunk>
          <ArrowDown size={designSystem.size.icon.s} />
        </NotShrunk>
      </LocationButton>
      {children}
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)<{ widgetWidth?: number }>(({ theme, widgetWidth }) => ({
  position: 'absolute',
  top: WIDGET_HEIGHT + theme.designSystem.size.spacing.s,
  left: (widgetWidth ?? 0) / 2,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))

const LocationButton = styledButton(Touchable)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: theme.designSystem.size.spacing.xxl,
  flexShrink: 1,
}))

const NotShrunk = styled.View({
  // We set to undefined to avoid shrink to be applied on the icons - otherwise their size is modified
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.designSystem.size.icon.m,
}))``

const LocationPointerNotFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.designSystem.size.icon.m,
}))``

const LocationTitle = styled(Typo.BodyAccent).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  flexShrink: 1,
  marginLeft: theme.designSystem.size.spacing.xs,
  marginRight: theme.designSystem.size.spacing.s,
}))
