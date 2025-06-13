import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useLocationForLocationWidgetDesktop } from 'features/location/components/useLocationForLocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { useLocationWidgetTooltip } from 'features/location/helpers/useLocationWidgetTooltip'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointerAppV2 } from 'ui/svg/icons/LocationPointerAppV2'
import { getSpacing, Typo } from 'ui/theme'

const TOOLTIP_WIDTH = getSpacing(58)
const WIDGET_HEIGHT = getSpacing(5 + 1) // textSize + padding

type LocationWidgetWrapperDesktopChildrenProps = {
  visible: boolean
  dismissModal: VoidFunction
}

type LocationWidgetWrapperDesktopProps = {
  screenOrigin: ScreenOrigin
  children: ({
    visible,
    dismissModal,
  }: LocationWidgetWrapperDesktopChildrenProps) => React.ReactNode
}

/**
 * The UI is the same so we just need a children as function
 * that will use modal props defined in
 * -> so children has to be a modal
 */
export const LocationWidgetWrapperDesktop: React.FC<LocationWidgetWrapperDesktopProps> = ({
  children,
  screenOrigin,
}) => {
  const { icons } = useTheme()
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

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const onPressLocationButton = () => {
    hideTooltip()
    showLocationModal()
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
          <ArrowDown size={icons.sizes.extraSmall} />
        </NotShrunk>
      </LocationButton>
      {children({ visible: locationModalVisible, dismissModal: hideLocationModal })}
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)<{ widgetWidth?: number }>(({ theme, widgetWidth }) => ({
  position: 'absolute',
  top: WIDGET_HEIGHT + getSpacing(2),
  left: (widgetWidth ?? 0) / 2,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))

const LocationButton = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(8),
  flexShrink: 1,
})

const NotShrunk = styled.View({
  // We set to undefined to avoid shrink to be applied on the icons - otherwise their size is modified
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.small,
}))({})

const LocationPointerNotFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  size: theme.icons.sizes.small,
}))({})

const LocationTitle = styled(Typo.BodyAccent).attrs({
  numberOfLines: 1,
})({
  flexShrink: 1,
  marginLeft: getSpacing(1),
  marginRight: getSpacing(2),
})
